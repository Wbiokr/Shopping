/**
 * 壓縮
 * @type {isJSON}
 */

const isJSON = require('koa-is-json');
const zlib = require('zlib');
module.exports = options => {
    return async function gzip(ctx,next) {
        await next();
        // 後續中間件執行完成後將響應體轉換成 gzip
        let body = this.body;
        if (!body) return;
        // 支持 options.threshold
        if (options.threshold && this.length < options.threshold) return;
        if (isJSON(body)) body = JSON.stringify(body);
        // 設置 gzip body，修正響應頭
        const stream = zlib.createGzip();
        stream.end(body);
        this.body = stream;
        this.set('Content-Encoding', 'gzip');
    };
};