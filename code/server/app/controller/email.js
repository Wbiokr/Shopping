/**
 * Controller
 * @param app
 */

let moment = require('moment');
module.exports = app => {
    return class EmailController extends app.Controller {
        async send(ctx){
            const {email,act,code} = ctx.request.body;
            if(code!=ctx.session.captcha){
                ctx.failure("驗證碼錯誤");
                return;
            }
            const user=await ctx.model.User.findOne({where:{username:email}});
            if(!user){
                ctx.failure("該郵件未註冊過");
                return;
            }
            let validTime=moment().add(2, 'h');
            let server=ctx.protocol+'://'+ctx.host;

            let json=[email,validTime.format('X')];
            let token=ctx.helper.cryptoStr(json.join(","));
            let url=`${server}/email/valid?act=forget&email=${email}&token=${token}`;
            switch (act){
                case "register":
                    await ctx.model.EmailValid.create({
                        email,validType:"R",token,url,validTime
                    });
                    ctx.helper.sendValidate({
                        to: email,
                        title: '歡迎註冊',
                        href: url,
                        success:function () {

                        }
                    });
                    ctx.success("郵件發送成功");
                    break;
                case "forget":
                    await ctx.model.EmailValid.create({
                        email,validType:"F",token,url,validTime
                    });
                    ctx.helper.sendValidate({
                        to: email,
                        title: '郵箱驗證',
                        href: url,
                        success:function () {

                        }
                    });
                    ctx.success("郵件發送成功");
                    break;
                default:
                    console.log("default");
            }
        }
        async valid(ctx){
            const {email,act,token} = ctx.query;
            let json=ctx.helper.decryptoStr(token).split(",");
            console.log(json);
            if(email!=json[0]||moment().format('X')>json[1]){
                ctx.throw(403);
                return;
            }
            let emailValid=await ctx.model.EmailValid.findOne({where:{token}});
            if(!emailValid){
                ctx.throw(404);
                return;
            }
            if(emailValid.validStatus=="S"||emailValid.validStatus=="C"){
                ctx.throw(404);
                return;
            }else if(moment().isAfter(emailValid.validTime)){
                emailValid.update({validStatus:"C"});
                ctx.throw(404);
                return;
            }
            switch (act){
                case "register":
                    break;
                case "forget":
                    await ctx.render('shop/red/forget',{valid:true,email,token});
                    break;
                default:
                    console.log("default");
            }
        }
    };
};
