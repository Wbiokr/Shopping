/**
 * 本地配置
 * @type
 * #sequelize-auto -h localhost -d apstorage -u apstorage -x apstorage
 */
exports.sequelize  = {
    // 单数据库信息配置

    dialect: 'mysql',
    // host
    host: 'gz-cynosdbmysql-grp-2ewhj4wl.sql.tencentcdb.com',
    // 端口号
    port: '23861',
    // 用户名
    username: 'root',
    // 密码
    password: '771881Chen',
    // 数据库名
    database: 'apshop',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false, // true by default
        freezeTableName: true
    },
    timezone: '+08:00' //东八时区
};
exports.security={
    domainWhiteList: [ '.weixin.qq.com']
};
