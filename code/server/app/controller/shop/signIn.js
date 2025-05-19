/**
 * Controller
 * @param app
 */

const JSEncrypt = require('node-jsencrypt');
module.exports = app => {
    return class SignInController extends app.Controller {
        async index(ctx){
            if (ctx.session.uid)
                ctx.redirect("/");
            else
                await ctx.render('shop/new/register');
        }
        async create(ctx) {
            let isRegister=ctx.app.locals.baseConfig.isRegister;
            if (isRegister!='1') {
                ctx.failure("平臺已關閉註冊，若有需要請聯繫官方微信!");
                return;
            }
            const {content,nickname,code} = ctx.request.body;
            const jsEncrypt = new JSEncrypt();
            jsEncrypt.setPrivateKey(app.config.private_key);
            let  _content = jsEncrypt.decrypt(content);
            console.log('_content', content, _content)
            if(!_content){
                ctx.failure("驗證失敗!");
                return;
            }
            let json=JSON.parse(_content);
            const {username,password}=json;
            if(code!=ctx.session.captcha){
                ctx.failure("驗證碼錯誤");
                return;
            }
            let user = await ctx.model.User.findOne({ where:{username}});
            if (user) {
                ctx.failure("用戶名已存在!");
                return;
            }
            await ctx.model.User.add(username, password,nickname);
            ctx.success('註冊成功!');
        }
    };
};
