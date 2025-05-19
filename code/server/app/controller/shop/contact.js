/**
 *  主頁Controller
 * @param app
 * @returns {OrderController}
 */

module.exports = app => {
    return class WishListController extends app.Controller {

        async index(ctx){
            let data= await ctx.getUserInfo();
            data.active_page=4;
            await this.ctx.render('shop/new/contact', data);
        }
        async create(ctx){
            const {name,tell,title,content,code} = ctx.request.body;
            let uid=ctx.session.uid;
            if(code!=ctx.session.captcha){
                ctx.failure("驗證碼錯誤");
                return;
            }
            await ctx.model.GuestMessage.create({
                uid,name,tell,title,content
            });
            return ctx.success("發送成功,我們會盡快跟您聯繫！");
        }
    };
};
