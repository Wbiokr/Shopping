/**
 *  主页Controller
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
            ctx.success("查询成功!",result.rows,result.count);
        }
        async detail(ctx){
            const order = await ctx.model.ShopOrder.findOne({where:{billNo:ctx.params.id},raw:true});
            if(!order){
                ctx.failure("查询失败");
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
            ctx.success("查询成功!",order);
        }
        async del(ctx){
            const order = await ctx.model.ShopOrder.findById(ctx.params.id);
            if(!order){
                ctx.failure("删除失败!");
                return;
            }
            if(order.billStatus=='S'){
                ctx.failure("已付款订单不允许删除!");
                return;
            }
            order.destroy();
            ctx.success("删除成功!");
        }
        async status(ctx) {
            let {billStatus, billNo,opBy} = ctx.request.body;
            let order = await ctx.model.ShopOrder.findById(billNo);
            if (!order) {
                ctx.failure("操作失败，未查询到订单信息！");
                return;
            }
            if(billStatus=='S'){
                let payDate=moment();
                let amount=Number(order.payableAmount)-Number(order.paidAmount);
                await ctx.model.ShopPayment.create({
                    billNo,payCode:order.payCode,payDate,uid:order.uid,paidAmount:amount,billStatus:"S",opBy,payType:'A',note:opBy+'管理员后台确认收款'
                });
            }
            order.update({
                billStatus
            });
            ctx.success("状态更新成功!");
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
                    { header: '订单编号', key: 'billNo', width: 10 },
                    { header: '下单时间', key: 'createTime', width: 20 },
                    { header: '支付编号', key: 'payCode', width: 10 },
                    { header: '客户', key: 'username', width: 30 },
                    { header: '订单金额', key: 'billAmount', width: 20 },
                    { header: '优惠金额', key: 'prefAmount', width: 20 },
                    { header: '应付金额', key: 'payableAmount', width: 20 },
                    { header: '实付金额', key: 'paidAmount', width: 20 },
                    { header: '备注', key: 'note', width: 20 },
                    { header: '状态', key: 'billStatus', width: 20 },
                ];
                const keys = columns.map(o => o.key)
                let csvContent = columns.map(o => o.header).join(',') + '\n';

                data.forEach(row => {
                    // 确保中文和特殊字符正确处理
                    const values = keys.map(k => row[k]);
                    csvContent += values.join(',') + '\n';
                });
                
                // 4. 设置响应头
                const fileName = encodeURIComponent('学生成绩表_' + new Date().getTime() + '.csv');
                ctx.set({
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                });
                
                // 5. 返回 CSV 内容（使用 UTF-8 BOM 确保 Excel 正确显示中文）
                ctx.status = 200;
                ctx.body = '\ufeff' + csvContent; // 添加 BOM 头

            } catch (error) {
                ctx.logger.error('导出 Excel 失败:', error);
                ctx.status = 500;
                ctx.body = { error: '导出失败，请重试' };
            }
            
        }
    };
};