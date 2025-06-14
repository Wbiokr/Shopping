/**
 * user Model
 * @param app
 * @returns {*}
 */
//導入加密模塊
var bcrypt = require('bcryptjs');
module.exports = app => {
    let user = app.model.import('../domain/user');
    user.add=async function(username,pass,nickname) {
        const saltRounds = 10;
        var salt = bcrypt.genSaltSync(saltRounds);
        var password = bcrypt.hashSync(pass, salt);
        const user= await this.create({
            username,nickname,
            'userType':'C'
        });
        //寫入登錄表
        const userLogin = await app.model.UserLogin.create({
            'loginString': username,
            password,
            'uid': user.uid,
            salt
        });
    };
    return user;
};