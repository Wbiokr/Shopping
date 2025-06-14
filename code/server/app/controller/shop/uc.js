/**
 *  主頁Controller
 * @param app
 * @returns {HomeController}
 */
module.exports = app => {
    return class UCController extends app.Controller {
        async index(ctx){
            let data=await ctx.getUserInfo();

            await ctx.render('shop/new/account',data);
        }
    };
};