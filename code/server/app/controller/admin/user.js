/**
 * Controller
 * @param app
 */

module.exports = app => {
    return class UserController extends app.Controller {
        async list(ctx){
            let {startDate,endDate,page,limit,status,username}=ctx.query;
            limit=Number(limit);
            let offset=(Number(page)-1)*limit;
            const Op = ctx.model.Op;
            const result = await ctx.model.User.findAndCountAll({
                // where:{username:{[Op.like]: `%${username}%`},status:{[Op.like]: `%${status}%`},createTime:{[Op.between]: [startDate, endDate]},userType:'C'
                where:{username:{[Op.like]: `%${username}%`},status:{[Op.like]: `%${status}%`},userType:'C'
                },offset,limit,raw:true
            });
            ctx.success("查詢成功!",result.rows,result.count);
        }
        async export(ctx) {
            try {
                // let {startDate,endDate,page,limit,billStatus,billNo}=ctx.query;
                // limit=Number(limit);
                // let offset=(Number(page)-1)*limit;
                // const Op = ctx.model.Op;
                const result = await ctx.model.User.findAndCountAll({
                    where:{},

                });
                const data = result.rows
                const columns = [
                    { header: '用戶暱稱', key: 'nickname', width: 10 },
                    { header: '賬號', key: 'username', width: 20 },
                    { header: '註冊時間', key: 'createTime', width: 10 },
                    // { header: '登錄次數', key: 'loginNum', width: 30 },
                    { header: '狀態', key: 'status', width: 20 },
                ];
                const keys = columns.map(o => o.key)
                let csvContent = columns.map(o => o.header).join(',') + '\n';

                data.forEach((row, index) => {
                    // 確保中文和特殊字符正確處理
                    const values = keys.map(k => k === 'status' ? row[k] == 'C' ? '禁用' : '正常' : row[k]);
                    csvContent += values.join(',') + '\n';
                });
                
                // 4. 設置響應頭
                const fileName = encodeURIComponent('用戶列表_' + new Date().getTime() + '.csv');
                ctx.set({
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                });
                
                // 5. 返回 CSV 內容（使用 UTF-8 BOM 確保 Excel 正確顯示中文）
                ctx.status = 200;
                ctx.body = '\ufeff' + csvContent; // 添加 BOM 頭

            } catch (error) {
                console.log(121212, error)
                ctx.logger.error('導出 Excel 失敗:', error);
                ctx.status = 500;
                ctx.body = { error: '導出失敗，請重試' };
            }
            
        }
        async info(ctx){
            const token = ctx.query.token;
            let uid=ctx.app.lru.get(token);
            let user = await ctx.model.User.findOne({
                attributes: ['uid', 'username','nickname','avatar','status','note'],
                where: {uid},raw:true
            });
            if (!user) {
                ctx.failure("token已失效!");
                return;
            }
            user.roles= ['admin'];
            user.introduction= user.nickname;
            user.name= user.username;
            ctx.success("獲取成功!",user);
        }
        async del(ctx){
            const user = await ctx.model.User.findById(ctx.params.id);
            if(!user){
                ctx.failure("刪除失敗!");
                return;
            }
            user.destroy();
            ctx.success("刪除成功!");
        }
        async status(ctx) {
            let {status, uid,opBy} = ctx.request.body;
            let user = await ctx.model.User.findById(uid);
            if (!user) {
                ctx.failure("操作失敗，未查詢到用戶信息！");
                return;
            }
            user.update({
                status,note:ctx.helper.note(user.note,statusFilter(status))
            });
            ctx.success("狀態更新成功!");
        }
    };
};
function statusFilter(status) {
    const statusMap = {
        0: '正常',
        C: '禁用',
    }
    return statusMap[status]
}
