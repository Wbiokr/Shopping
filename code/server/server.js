// server.js
const egg = require('egg');

const app = egg.startCluster({
  baseDir: __dirname,
  port: process.env.PORT || 7001, // Vercel 会动态分配端口
});

module.exports = app;