/**
 *  主頁Controller
 * @param app
 * @returns {OrderController}
 */
const moment = require('moment');
const axios=require('axios');
let crypto=require("crypto");
module.exports = app => {
    return class OrderController extends app.Controller {
        async index(ctx){
            let data= await ctx.getUserInfo();
            let billNo=ctx.params.billNo;
            const order=await ctx.model.ShopOrder.findById(billNo);
            if(!order){
                ctx.throw(404);
                return;
            }
            data.order=order;
            if(order.billStatus=="S"){
                await this.ctx.render('shop/red/order-detail', data);
                return;
            }
            await this.ctx.render('shop/red/pay', data);
        }
        async confirm(ctx){
            let me=this;
            let billNo=ctx.params.billNo;
            const order=await ctx.model.ShopOrder.findById(billNo);
            if(!order){
                ctx.failure("訂單編號錯誤!");
                return;
            }
            switch (order.billStatus){
                case "S":
                    ctx.success("訂單已支付成功，趕快去下載吧!");
                    return;
                case "L":
                    let acc=order.payableAmount-order.paidAmount;
                    if(acc>0){
                        ctx.failure("您還需要再支付:" + acc + "元，如果已經付清，請稍候再查詢(大約1分鐘)。");
                    }
                    return;
                case "P":
                    let time=moment().format('X');
                    let payCode=order.payCode;
                    // 簽名
                    let md5 = crypto.createHash("md5");
                    let token = [
                        payCode,
                        time.toString(),
                        app.config.payKeys
                    ].join("|");
                    token = md5.update(token, "utf8").digest("hex");
                    let response=await axios.get(app.config.payServer+'/api/order', {
                        params: {payCode, time, token}
                    }).catch(function (error) {
                        console.log(error);
                        me.failure("訂單還未支付，如果已經轉賬，請稍候再查詢(大約1分鐘)。");
                        return;
                    });
                    if(response) {
                        let res = response.data;
                        if (res.success) {
                            sleep(3000);
                            let i = 0;
                            while (i < 2) {
                                let order2 = await ctx.model.ShopOrder.findById(billNo);
                                if (order2.billStatus == "S") {
                                    me.success("訂單已支付成功，趕快去下載吧!");
                                    return;
                                } else if (order2.billStatus == "L") {
                                    let acc = order.payableAmount - order.paidAmount;
                                    me.failure("您還需要再支付:" + acc + "元，如果已經付清，請稍候再查詢(大約1分鐘)。");
                                    return;
                                } else {
                                    sleep(2000);
                                    i++;
                                    me.failure("訂單還未支付，如果已經轉賬，請稍候再查詢(大約1分鐘)。");
                                    continue;
                                }
                            }
                        } else {
                            console.log(JSON.stringify(res));
                            me.failure("訂單還未支付，如果已經轉賬，請稍候再查詢(大約1分鐘)。");
                        }
                    }
                    return;
            }
        }
    };
};
function sleep(sleepTime) {
    for(let start = +new Date; +new Date - start <= sleepTime;) {};
}
