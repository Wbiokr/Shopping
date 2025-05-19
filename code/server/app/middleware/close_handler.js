/**
 * 統一錯誤處理
 * @returns {Function}
 */
module.exports = () => {
    return async function (ctx,next) {
        let isClose=ctx.app.locals.baseConfig.isClose;
        if (isClose=='1') {
            await ctx.render('close',{msg:ctx.app.locals.baseConfig_closeReason});
        } else
            await next();
    };
};
