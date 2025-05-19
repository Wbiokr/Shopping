/**
 *
 * @returns {Function}
 */
let fs = require("fs");
module.exports = () => {
    return async function (ctx,next) {
        /* 安裝檢測 */
        if (!fs.existsSync(ctx.app.root_path+'/data/install.lock')) {
            ctx.redirect('/install');
        }
    };
};
