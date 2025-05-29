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
        async pageList(ctx){
            let {name, page, limit}=ctx.query;
            page=Number(page);
            limit=Number(limit);
            let offset=(Number(page)-1)*limit;
            const Op = ctx.model.Op;
            const result = await ctx.model.ShopGoodsClass.findAndCountAll({
                where:{[Op.or]:[{name:{[Op.like]: `%${name}%`}}]},offset,limit
            }); 
            ctx.success("查詢成功",result.rows,result.count);
        }
        async create(ctx){
            let {name, parentId, status, sortNo, isLeaf, delFlag}=ctx.request.body;
            // let opAt=moment();
            const result = await ctx.model.ShopGoodsClass.create({name, parentId, status, sortNo, delFlag, isLeaf});
            ctx.success("新增成功",result); 
        }
        async update(ctx){
            let {goodsClassID, name, parentId, status, sortNo, isLeaf, delFlag}=ctx.request.body;
            // let opAt=moment();
            const result = await ctx.model.ShopGoodsClass.update({name, parentId, status, sortNo, delFlag, isLeaf},{where:{goodsClassID}});
            ctx.success("修改成功",result); 
        }
        async del(ctx){
            let {goodsClassID}=ctx.query;
            // const result = await ctx.model.ShopGoodsClass.update({delFlag:1},{where:{id}});
            // 
            const result = await ctx.model.ShopGoodsClass.destroy({where:{goodsClassID}});
            ctx.success("刪除成功",result); 
        }
    };
};
