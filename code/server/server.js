// server.js
let egg
try {
  egg = require('egg');
  console.log('Egg.js 模块加载成功HAHA:', egg); // 添加日志
} catch (error) {
  console.error('Egg.js 模块加载失败:', error);
  throw error;
}

const app = egg.startCluster({
  baseDir: __dirname,
  port: process.env.PORT || 7001,
});

module.exports = app;