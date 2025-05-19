/**
 * Controller
 * @param app
 */


module.exports = app => {
    return class ShopGoodsClassController extends app.Controller {
        async list(ctx){
            // let {where, page, limit}=ctx.query;
                // const result=await ctx.model.ShopGoodsClass.findAll({
                //     where, page, limit, raw:true
                // });
                // console.log('page::::', page, limit, where)
                const result = await ctx.model.ShopGoodsClass.findAll({
                    where:{status:'0',parentID:0}
                });
                ctx.success("查詢成功",result);
            // } catch (error) {
            //     console.log(error);
            // }
        }
    };
};
