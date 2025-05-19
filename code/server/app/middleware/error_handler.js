/**
 * 統一錯誤處理
 * @returns {Function}
 */
module.exports = () => {
    return async function (ctx,next) {
        try {
            await next();
        } catch (err) {
            // 所有的異常都在 app 上觸發一個 error 事件，框架會記錄一條錯誤日誌
            ctx.app.emit('error', err, ctx);

            const status = err.status || 500;
            // 生產環境時 500 錯誤的詳細錯誤內容不返回給客戶端，因為可能包含敏感信息
            const error = status === 500 && ctx.app.config.env === 'prod'
                ? '服務器異常，請聯繫客服。'
                : err.message;
            if (ctx.acceptJSON) {
                ctx.body = {
                    success: false,
                    msg:error,
                    result:null,
                };
                if (status === 422) {
                    ctx.body.detail = err.errors;
                }
            } else {
                await ctx.render('500',{msg:JSON.stringify(error)});
            }
            ctx.status = 200;
        }
    };
};