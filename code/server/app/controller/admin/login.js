/**
 * 登錄Controller
 * @param app
 */

let bcrypt = require('bcryptjs');
const JSEncrypt = require('node-jsencrypt');
let moment=require('moment');
const crypto = require('crypto');
module.exports = app => {
    return class LoginController extends app.Controller {
        async login(ctx) {
            const {content} = ctx.request.body;
            const jsEncrypt = new JSEncrypt();
            jsEncrypt.setPrivateKey(app.config.private_key);
            let _content = jsEncrypt.decrypt(content);
            if (!_content) {
                ctx.failure("驗證失敗!");
                return;
            }
            let json = JSON.parse(_content);
            const {username, password} = json;
            //const {username, password}= ctx.request.body;
            let user = await ctx.model.User.findOne({where: {username}});
            if (!user) {
                ctx.failure("用戶名或密碼錯誤!");
                return;
            }
            if (user.userType!='A') {
                ctx.failure("非管理員身份禁止登錄!");
                return;
            }
            let userLogin = await ctx.model.UserLogin.findOne({where: {loginString: username}});
            if (!userLogin) {
                ctx.failure("用戶登錄信息不存在!");
                return;
            }
            let res = bcrypt.compareSync(password, userLogin.password);
            if (res) {
                await ctx.model.UserLoginL.create({uid: user.uid,loginString:username,loginLogType:'L'});
                user.update({
                    loginNum:user.loginNum+1,
                    lastLoginTime:moment()
                });
                let hash = crypto.createHash('md5');
                hash.update(user.uid.toLocaleString());
                let token=hash.digest('hex');
                ctx.app.lru.set(token,user.uid);
                ctx.session.uid=user.uid;
                ctx.session.username=username;
                ctx.session.nickname=user.nickname;
                ctx.success("登錄成功!",{token});
                return;
            } else {
                ctx.failure("用戶名或密碼錯誤!");
                return;
            }
            ctx.failure("登錄失敗!");
        }
        async logout(ctx) {
            const {token}= ctx.request.body;
            let uid=ctx.app.lru.get(token);
            console.log(uid);
            let user = await ctx.model.User.findOne({where: {uid},raw:true});
            if (!user) {
                ctx.success("token已失效!");
                return;
            }
            ctx.model.UserLoginL.create({uid:user.uid,loginString:user.username,loginLogType:'Q'});
            ctx.app.lru.set(token,null);
            ctx.success("退出成功!");
        }
    };
};
