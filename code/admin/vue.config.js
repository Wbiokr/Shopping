const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭保存时的 ESLint 检查
  outputDir: '../server/app/public/admin',
  indexPath: path.resolve('../server/app/view/admin/index.html'),
  publicPath: process.env.NODE_ENV === 'production'
    ? '/public/admin'
    : '/public',
  devServer: {
      port: 8080,
      open: false,
      headers: {
          'Access-Control-Allow-Origin': '*',
      },
      proxy: {
          // change xxx-api/login => mock/login
          // detail: https://cli.vuejs.org/config/#devserver-proxy
          [process.env.VUE_APP_BASE_API]: {
              target: 'http://127.0.0.1:7001/',
              changeOrigin: true,
              // pathRewrite: {
              //     ['^' + backEndPath]: '',
              // },
          },
          '/public/upload': {
              target: 'http://127.0.0.1:7001/',
              changeOrigin: true,
          },
      },
      // after: require('./mock/mock-server.js'),
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {
        'fs': false, // 忽略 fs 模块
        // 为 stream 提供浏览器替代
        'stream': require.resolve('stream-browserify'),
        // 通常还需要 buffer 作为依赖
        'buffer': require.resolve('buffer/'),
        process: require.resolve('process/browser'), // 添加 process 替代
        'crypto': require.resolve('crypto-browserify'), // 为 crypto 提供浏览器替代
      }
    }
  },
  chainWebpack: config => {
    // 排除 icons 目录中 svg 文件的默认处理
    const svgRule = config.module.rule('svg');
    svgRule.exclude.add(/@\/icons\/svg/);
    // 添加 svg-sprite-loader 处理 icons 目录中的 svg
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(/@\/icons\/svg/)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]' // 定义 symbol 的 ID 格式
      });
  },
})
