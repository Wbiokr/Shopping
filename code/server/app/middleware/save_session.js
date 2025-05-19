/**
 * 進入保存session
 * @returns {Function}
 */
module.exports = () => {
    return async function (ctx,next) {
        await next();
        // 如果 Session 是空的，則不保存
        if (!ctx.session) return;
        ctx.session.save();
    };
};