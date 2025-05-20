/**
 *  主頁Controller
 * @param app
 * @returns {GoodsController}
 */
module.exports = app => {
    return class GoodsController extends app.Controller {
        async index(ctx){
            let data= await ctx.getUserInfo();
            let goodsClassID=ctx.query.goodsClassID;
            data.active_page=1;
            const shopRecommendGoods = await ctx.model.ShopGoods.findAll({
                where:{recommendFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
                limit:3
            });
            data.shopRecommendGoods=shopRecommendGoods;

            if(goodsClassID){
                data.shopGoods = await ctx.model.ShopGoods.findAll({
                    where:{recommendFlag:'0',goodsStatus:'U',goodsClassID},
                    order:[['sortNo', 'ASC']],
                    limit:9
                });
            }else{
                data.shopGoods = await ctx.model.ShopGoods.findAll({
                    // where:{recommendFlag:'0',goodsStatus:'U'},
                    where:{goodsStatus:'U'},
                    order:[['sortNo', 'ASC']],
                    limit:9
                });
            }
            data.goodsClass=await ctx.model.ShopGoodsClass.findAll({
                where:{status:'0',parentID:0}
            });
            await ctx.render('shop/new/goods-listing', data);
        }
        async query(ctx) {
            // const { ctx, service } = this;
            // 校驗參數
            // ctx.validate({
            //     page: { type: 'int', required: false, default: 1 },
            //     pageSize: { type: 'int', required: false, default: 10 },
            //     sortField: { type: 'string', required: false, default: 'opAt' },
            //     sortOrder: { type: 'string', required: false, default: 'desc', values: ['asc', 'desc'] },
            //     keyword: { type: 'string', required: false },
            //     categoryId: { type: 'int', required: false }
            // }, ctx.query);

            const {
                page,
                pageSize = 9,
                sortField = 'opAt',
                sortOrder = 'desc',
                keyword,
                // categoryId
            } = ctx.query || {};

            // 構建查詢條件
            const where = {goodsStatus:'U'};
            if (keyword) where.name = { [ctx.app.Sequelize.Op.like]: `%${keyword}%` };
            // if (categoryId) where.categoryId = categoryId;
// console.log(12121, sortField, sortOrder, where)
            // 執行查詢
            const result = await ctx.model.ShopGoods.findAndCountAll({
                where,
                offset: (page - 1) * pageSize,
                limit: parseInt(pageSize) || 9,
                order: [[sortField, sortOrder]]
            });

            ctx.success('查詢成功', {

                    list: result.rows,
                    pagination: {
                        total: result.count,
                        page,
                        pageSize
                    }
            });
        }
        async price(ctx) {
            const {
                price
            } = ctx.query || {};

            // 構建查詢條件
            const where = {goodsStatus:'U', price: { [ctx.app.Sequelize.Op.eq]: parseFloat(price) }};
            const result = await ctx.model.ShopGoods.findAndCountAll({
                where,
                offset: 0,
                limit: 5,
            });

            console.log('rrrrrr', result)

            ctx.success('查詢成功', result.rows);
        }
        async show(ctx){
            let data=await ctx.getUserInfo();
            const goods = await ctx.model.ShopGoods.findById(ctx.params.id);
            if(!goods){
                ctx.throw(404);
                return;
            }
            data.goods=goods;
            const goodsImages = await ctx.model.ShopGoodsImages.findAll({
                where:{goodsID:goods.goodsID},
                order:[['sortNo', 'ASC']]
            });
            data.goodsImages=goodsImages;
            const shopRecommendGoods = await ctx.model.ShopGoods.findAll({
                where:{recommendFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
                limit:3
            });
            data.shopRecommendGoods=shopRecommendGoods;
            await this.ctx.render('shop/new/product-detail', data);
        }
        async get(ctx){
            let data=await ctx.getUserInfo();
            let search=ctx.query.search;
            const Op = ctx.model.Op;
            const shopGoods = await ctx.model.ShopGoods.findAll({
                where:{
                    [Op.or]:[{name:{[Op.like]: `%${search}%`}},{title:{[Op.like]: `%${search}%`}}]
                }
            });
            data.shopGoods=shopGoods;
            //const shopHotGoods = await ctx.model.query("SELECT * FROM `shop_goods` where goodsID in (SELECT goodsID FROM shop_hot_goods)", { type: ctx.model.QueryTypes.SELECT});
            const shopRecommendGoods = await ctx.model.ShopGoods.findAll({
                where:{recommendFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
                limit:3
            });
            data.shopHotGoods=shopRecommendGoods;
            await this.ctx.render('shop/red/search', data);
        }
        async myProduct(ctx){
            let data=await ctx.getUserInfo();
            const goods = await ctx.model.ShopUserGoods.findAll({where:{uid:ctx.session.uid}});
            data.goods=goods;
            await this.ctx.render('shop/new/my-product', data);
        }
    };
};
