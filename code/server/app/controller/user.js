/**
 * Controller
 * @param app
 */

let bcrypt = require('bcryptjs');
const JSEncrypt = require('node-jsencrypt');
module.exports = app => {
    return class UserController extends app.Controller {
        async index(ctx){
            console.log(ctx.session.uid);
        }
        async updatePassword(ctx){
            const {content} = ctx.request.body;
            const jsEncrypt = new JSEncrypt();
            jsEncrypt.setPrivateKey(app.config.private_key);
            let _content = jsEncrypt.decrypt(content);
            if (!_content) {
                ctx.failure("驗證失敗!");
                return;
            }
            let json = JSON.parse(_content);
            const {oldPassword, newPassword} = json;
            let userLogin = await ctx.model.UserLogin.findById(ctx.session.username);
            if (!userLogin) {
                ctx.failure("修改失敗!");
                return;
            }
            let res = bcrypt.compareSync(oldPassword, userLogin.password);
            if (res) {
                const saltRounds = 10;
                let salt = bcrypt.genSaltSync(saltRounds);
                let password = bcrypt.hashSync(newPassword, salt);
                userLogin.update({password,salt});
                ctx.session = null;
                ctx.success("修改成功!");
                return;
            }else {
                ctx.failure("原密碼錯誤!");
                return;
            }
        }
    };
};