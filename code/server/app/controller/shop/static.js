
module.exports = app => {
    return class StaticController extends app.Controller {
        async privacy(ctx){
            await ctx.render('shop/new/privacy');
        }
    };
};
