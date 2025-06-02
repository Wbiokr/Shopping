// server.js
console.log('Starting Egg.js server in Vercel environment...');
console.log('Environment variables:', process.env);
// server.js
let egg = require('egg');
try {
  console.log('Egg.js 模块加载成功HAHA:', egg); // 添加日志
} catch (error) {
  console.error('Egg.js 模块加载失败:', error);
  throw error;
}

console.log('Starting Egg.js server...');

const app = egg.startCluster({
  baseDir: __dirname,
  port: process.env.PORT || 7001,
});

console.log('Egg.js app started successfully');

module.exports = app;