/**
 *  主页Controller
 * @param app
 * @returns {OrderController}
 */
module.exports = app => {
    return class WishListController extends app.Controller {

        async index(ctx){
            let data= await ctx.getUserInfo();
            const res = await this.ctx.model.ShopUserWishlist.findAndCountAll({
                where:{uid:data.uid}
            });
            data.wishlist=res.rows;
            // data.collectGoods = res.rows.map(o =>)
            await this.ctx.render('shop/new/wishlist', data);
        }

        async list(ctx) {
            let data= await ctx.getUserInfo();
            const res = await this.ctx.model.ShopUserWishlist.findAndCountAll({
                where:{uid:data.uid}
            });
            return ctx.success('查询成功', res)
        }
        async del(ctx){
            const wishlist = await ctx.model.ShopUserWishlist.findById(parseInt(ctx.params.id));
            console.log('deelll', ctx.params, wishlist, 'eeeee');
            wishlist.destroy();
            ctx.success("删除成功!");
        }
        async create(ctx) {
            const {goodsID} = ctx.request.body;
            let uid=ctx.session.uid;
            const goods=await ctx.model.ShopGoods.findById(goodsID);
            const cart=await ctx.model.ShopUserWishlist.findOrCreate({
                where: {goodsID,uid},
                defaults:{uid,goodsID,name:goods.name,imgurl:goods.imgurl,goodsType:goods.goodsType,price:goods.price}
            });
            return ctx.success("添加成功!",cart);
        }
    };
};