/**
 *  主頁Controller
 * @param app
 * @returns {HomeController}
 */
module.exports = app => {
    return class HomeController extends app.Controller {
        async index(ctx){
            let data= await ctx.getUserInfo();
            let shopRecommendGoods = await ctx.model.ShopGoods.findAll({
                where:{recommendFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
            });
            data.shopRecommendGoods=shopRecommendGoods;

            let bannerGoods = await ctx.model.ShopGoods.findAll({
                where:{bannerFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
            });
            data.bannerGoods=bannerGoods;

            let newGoods = await ctx.model.ShopGoods.findAll({
                where:{newFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
            });
            data.newGoods=newGoods;

            let hotGoods = await ctx.model.ShopGoods.findAll({
                where:{hotFlag:'1',goodsStatus:'U'},
                order:[['sortNo', 'ASC']],
            });
            data.hotGoods=hotGoods;


            let subjects = await ctx.model.Subject.findAll({
                where:{status:'0'},
                order:[['createTime', 'desc']],
                limit:3
            });
            let blogs = await ctx.model.Blog.findAll({
                where:{status:'0'},
                order:[['createTime', 'desc']],
                limit:3
            });
            data.subjects=subjects;
            data.blogs=blogs;
            data.active_page=1;
            await this.ctx.render('shop/new/index', data);

        }
    };
};
