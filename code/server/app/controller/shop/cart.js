/**
 *  主頁Controller
 * @param app
 * @returns {CartController}
 */
module.exports = app => {
    return class CartController extends app.Controller {
        async show(ctx){
            let data= await ctx.getUserInfo();
            await ctx.render('shop/new/cart',data);
        }
        async list(ctx) { 
            let data= await ctx.getUserInfo();
            ctx.success('查詢成功', data)
        }
        async clear(ctx) {
            const data= await ctx.getUserInfo();
            data.cart.forEach(async o => {
                o.destroy()
            })
            ctx.success('清空成功')
        }
        async del(ctx){
            const cart = await ctx.model.ShopCart.findById(ctx.params.id);
            cart.destroy();
            ctx.success("刪除成功!");
        }
        async create(ctx) {
            let {goodsID,num,price,isForce} = ctx.request.body;
            let uid=ctx.session.uid;
            const goods=await ctx.model.ShopGoods.findById(goodsID);
            const data= await ctx.getUserInfo();
            const currentGoodsCart=data.cart.find(item=>item.goodsID==goodsID);
            if (currentGoodsCart && !isForce) {
                num = parseInt(num) + parseInt(currentGoodsCart.num);
            } else {
                console.log('--------newNum-------', num)
            }
            const [instance, created]=await ctx.model.ShopCart.findOrCreate({
                where: {goodsID,uid},
                defaults:{uid,goodsID,name:goods.name,num,price,imgurl:goods.imgurl,goodsType:goods.goodsType}
            });
            if (!created) {
                instance.num = num;
                instance.price = price;
                await instance.save();
            }
            return ctx.success("添加成功!", instance);
        }
    };
};