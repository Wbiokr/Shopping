/**
 * 數據庫基本對象操作
 */
const { Controller } = require('egg');
class TreeController extends Controller {
    async index(ctx){
        let model = ctx.params.model;
        let {where}=ctx.query;
        let modelClass=model.substring(0,1).toUpperCase()+model.substring(1);
        let res = await ctx.model.query(`select * from ${model} where ${where}`, {
            model: ctx.model[modelClass] ,
            type: ctx.model.QueryTypes.SELECT,
        });
        ctx.success("查詢成功!", res);

    }
    async show(ctx) {
        let model = ctx.params.model;
        let modelClass=model.substring(0,1).toUpperCase()+model.substring(1);
        let id = ctx.params.id;
        let res = await ctx.model[modelClass].findById(id);
        ctx.success("查詢成功!", res);

    }
    async create(ctx){
        let model=ctx.params.model;
        let modelClass=model.substring(0,1).toUpperCase()+model.substring(1);
        let body = ctx.request.body;
        let res=await ctx.model[modelClass].create(body);
        ctx.success("保存成功!",res);
    }
    async update(ctx){
        let model=ctx.params.model;
        let modelClass=model.substring(0,1).toUpperCase()+model.substring(1);
        let id=ctx.params.id;
        let body = ctx.request.body;
        let res=await ctx.model[modelClass].findById(id);
        if(res){
            res.update(body);
            ctx.success("更新成功!");
            return;
        }
        ctx.failure("更新失敗!");
    }
    async destroy(ctx){
        let model=ctx.params.model;
        let modelClass=model.substring(0,1).toUpperCase()+model.substring(1);
        let id=ctx.params.id;
        let res=await ctx.model[modelClass].findById(id);
        if(res){
            res.destroy();
            ctx.success("刪除成功!");
            return;
        }
        ctx.failure("刪除失敗!");
    }
}
module.exports = TreeController;
