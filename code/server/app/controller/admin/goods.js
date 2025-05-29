/**
 *  主頁Controller
 * @param app
 * @returns {GoodsController}
 */
const moment=require('moment')
module.exports = app => {
    return class GoodsController extends app.Controller {
        async create(ctx){
            const {goodsID,name, title,goodsType,imgurl,price,priceMarket,stock,note,goodsStatus,sortNo,opBy,goodsImages,recommendFlag,goodsClassID}= ctx.request.body;
            let opAt=moment();
            let goods;
        
            if(goodsID){
                goods=await ctx.model.ShopGoods.findById(goodsID);
                if(!goods){
                    ctx.failure("保存失敗，未查詢到商品相關信息！");
                    return;
                }else{
                    goods.update({
                        name, title,goodsType,imgurl,price,priceMarket,stock,note,goodsStatus,sortNo,opBy,opAt,recommendFlag,goodsClassID
                    });
                    await ctx.model.query("DELETE FROM `shop_goodsImages` where goodsID = :goodsID", { replacements: { goodsID },type: ctx.model.QueryTypes.DELETE});
                    for(let index in goodsImages){
                        await ctx.model.ShopGoodsImages.create({
                            goodsID:goodsID,imgurl:goodsImages[index].url,name:goodsImages[index].name,sortNo:index
                        });
                    }
                }
            }else{
                goods=await ctx.model.ShopGoods.create({
                    name, title,goodsType,imgurl,price,priceMarket,stock,note,goodsStatus,sortNo,opBy,opAt,recommendFlag,goodsClassID
                });
                for(let index in goodsImages){
                    await ctx.model.ShopGoodsImages.create({
                        goodsID:goods.goodsID,imgurl:goodsImages[index].url,name:goodsImages[index].name,sortNo:index
                    });
                }
            }
            ctx.success("保存成功!");
        }
        async list(ctx){
            let {title,page,limit,type}=ctx.query;
            limit=Number(limit);
            let offset=(Number(page)-1)*limit;
            const Op = ctx.model.Op;
            const result = await ctx.model.ShopGoods.findAndCountAll({
                where:{
                    [Op.or]:[{name:{[Op.like]: `%${title}%`}},{title:{[Op.like]: `%${title}%`}}],goodsType:{[Op.like]: `%${type}%`}
                },offset,limit
            });
            ctx.success("查詢成功!",result.rows,result.count);
        }
        async detail(ctx){
            const goods = await ctx.model.ShopGoods.findOne({where:{goodsID:ctx.params.id},raw:true});
            if(!goods){
                ctx.failure("查詢失敗!!");
                return;
            }
            const goodsImages = await ctx.model.ShopGoodsImages.findAll({
                where:{goodsID:goods.goodsID},
                order:[['sortNo', 'ASC']],
                raw:true
            });
            let imgs=[];
            for(let img of goodsImages){
                imgs.push({name:img.name,url:img.imgurl,status:'finished'});
            }
            goods.goodsImages=imgs;
            ctx.success("查詢成功!",goods);
        }
        async del(ctx){
            const goods = await ctx.model.ShopGoods.findById(ctx.params.id);
            if(!goods){
                ctx.failure("刪除失敗!");
                return;
            }
            if(goods.goodsStatus=='U'){
                ctx.failure("上架商品不允許刪除，請先下架!");
                return;
            }
            goods.destroy();
            ctx.success("刪除成功!");
        }
        async status(ctx) {
            let {goodsStatus, goodsID} = ctx.request.body;
            let goods = await ctx.model.ShopGoods.findById(goodsID);
            if (!goods) {
                ctx.failure("操作失敗，未查詢到商品相關信息！");
                return;
            }
            goods.update({
                goodsStatus
            });
            ctx.success("狀態更新成功!");
        }
        async recommend(ctx) {
            let {flag, k, goodsID} = ctx.request.body;
            console.log(goodsID, k, flag)
            let goods = await ctx.model.ShopGoods.findById(goodsID);
            if (!goods) {
                ctx.failure("操作失敗，未查詢到商品相關信息！");
                return;
            }
            goods.update({
                [k]:  flag
            });
            ctx.success("狀態更新成功!");
        }
        async export(ctx) {
            try {
                // let {startDate,endDate,page,limit,billStatus,billNo}=ctx.query;
                // limit=Number(limit);
                // let offset=(Number(page)-1)*limit;
                // const Op = ctx.model.Op;
                const result = await ctx.model.ShopGoods.findAndCountAll({
                    where:{},

                });
                const data = result.rows
                const columns = [
                    { header: '商品編號', key: 'goodsID', width: 10 },
                    { header: '發佈時間', key: 'createTime', width: 20 },
                    { header: '標題', key: 'title', width: 10 },
                    { header: '分類', key: 'goodsClassId', width: 10 },
                    { header: '單價', key: 'price', width: 30 },
                    { header: '銷售量', key: 'numSale', width: 20 },
                    { header: '是否推薦', key: 'recommendFlag', width: 20 },
                    { header: '是否banner', key: 'bannerFlag', width: 20 },
                    { header: '是否新品', key: 'newFlag', width: 20 },
                    { header: '是否熱銷', key: 'hotFlag', width: 20 },
                    { header: '狀態', key: 'goodsStatus', width: 20 },
                ];
                const keys = columns.map(o => o.key)
                let csvContent = columns.map(o => o.header).join(',') + '\n';

                data.forEach(row => {
                    // 確保中文和特殊字符正確處理
                    const values = keys.map(k => row[k]);
                    csvContent += values.join(',') + '\n';
                });
                
                // 4. 設置響應頭
                const fileName = encodeURIComponent('商品列表_' + new Date().getTime() + '.csv');
                ctx.set({
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                });
                
                // 5. 返回 CSV 內容（使用 UTF-8 BOM 確保 Excel 正確顯示中文）
                ctx.status = 200;
                ctx.body = '\ufeff' + csvContent; // 添加 BOM 頭

            } catch (error) {
                console.log(121212, error)
                ctx.logger.error('導出 Excel 失敗:', error);
                ctx.status = 500;
                ctx.body = { error: '導出失敗，請重試' };
            }
            
        }
    };
};