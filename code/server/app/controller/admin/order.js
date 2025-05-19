/**
 *  主頁Controller
 * @param app
 * @returns {GoodsController}
 */
const moment=require('moment')
// const XLSX = require('xlsx')
// const ExcelJS = require('exceljs');

module.exports = app => {
    return class GoodsController extends app.Controller {
        async list(ctx){
            let {startDate,endDate,page,limit,billStatus,billNo}=ctx.query;
            limit=Number(limit);
            let offset=(Number(page)-1)*limit;
            const Op = ctx.model.Op;
            const result = await ctx.model.ShopOrder.findAndCountAll({
                where:{billNo:{[Op.like]: `%${billNo}%`},billStatus:{[Op.like]: `%${billStatus}%`},billDate:{[Op.between]: [startDate, endDate]}
                },offset,limit
            });
            ctx.success("查詢成功!",result.rows,result.count);
        }
        async detail(ctx){
            const order = await ctx.model.ShopOrder.findOne({where:{billNo:ctx.params.id},raw:true});
            if(!order){
                ctx.failure("查詢失敗");
                return;
            }
            const goodsImages = await ctx.model.ShopOrderImages.findAll({
                where:{billNo:order.billNo},
                order:[['sortNo', 'ASC']],
                raw:true
            });
            let imgs=[];
            for(let img of goodsImages){
                imgs.push({name:img.name,url:img.imgurl,status:'finished'});
            }
            order.goodsImages=imgs;
            ctx.success("查詢成功!",order);
        }
        async del(ctx){
            const order = await ctx.model.ShopOrder.findById(ctx.params.id);
            if(!order){
                ctx.failure("刪除失敗!");
                return;
            }
            if(order.billStatus=='S'){
                ctx.failure("已付款訂單不允許刪除!");
                return;
            }
            order.destroy();
            ctx.success("刪除成功!");
        }
        async status(ctx) {
            let {billStatus, billNo,opBy} = ctx.request.body;
            let order = await ctx.model.ShopOrder.findById(billNo);
            if (!order) {
                ctx.failure("操作失敗，未查詢到訂單信息！");
                return;
            }
            if(billStatus=='S'){
                let payDate=moment();
                let amount=Number(order.payableAmount)-Number(order.paidAmount);
                await ctx.model.ShopPayment.create({
                    billNo,payCode:order.payCode,payDate,uid:order.uid,paidAmount:amount,billStatus:"S",opBy,payType:'A',note:opBy+'管理員後臺確認收款'
                });
            }
            order.update({
                billStatus
            });
            ctx.success("狀態更新成功!");
        }
        async export(ctx) {
            try {
                let {startDate,endDate,page,limit,billStatus,billNo}=ctx.query;
                // limit=Number(limit);
                // let offset=(Number(page)-1)*limit;
                const Op = ctx.model.Op;
                const result = await ctx.model.ShopOrder.findAndCountAll({
                    where:{billNo:{[Op.like]: `%${billNo}%`},billStatus:{[Op.like]: `%${billStatus}%`},billDate:{[Op.between]: [startDate, endDate]}
                    }
                });
                const data = result.rows

                const columns = [
                    { header: '訂單編號', key: 'billNo', width: 10 },
                    { header: '下單時間', key: 'createTime', width: 20 },
                    { header: '支付編號', key: 'payCode', width: 10 },
                    { header: '客戶', key: 'username', width: 30 },
                    { header: '訂單金額', key: 'billAmount', width: 20 },
                    { header: '優惠金額', key: 'prefAmount', width: 20 },
                    { header: '應付金額', key: 'payableAmount', width: 20 },
                    { header: '實付金額', key: 'paidAmount', width: 20 },
                    { header: '備註', key: 'note', width: 20 },
                    { header: '狀態', key: 'billStatus', width: 20 },
                ];
                const keys = columns.map(o => o.key)
                let csvContent = columns.map(o => o.header).join(',') + '\n';

                data.forEach(row => {
                    // 確保中文和特殊字符正確處理
                    const values = keys.map(k => row[k]);
                    csvContent += values.join(',') + '\n';
                });
                
                // 4. 設置響應頭
                const fileName = encodeURIComponent('訂單列表_' + new Date().getTime() + '.csv');
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
                ctx.logger.error('導出 Excel 失敗:', error);
                ctx.status = 500;
                ctx.body = { error: '導出失敗，請重試' };
            }
            
        }
    };
};