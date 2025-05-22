
module.exports = app => {
    return class StaticController extends app.Controller {
        async privacy(ctx){
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/privacy', data);
        }

        async vipService(ctx){
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/service', data);
        }

        async law(ctx){
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/law', data);
        }

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
