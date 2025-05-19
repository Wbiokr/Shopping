
module.exports = app => {
    return class StaticController extends app.Controller {
        async privacy(ctx){
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/privacy', data);
        }

        async aboutUs(ctx) {
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/about-us', data);
        }
    };
};
