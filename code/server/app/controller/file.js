/**
 * Controller
 * @param app
 */
const path = require('path');
let fs = require("fs");
module.exports = app => {
    return class FileController extends app.Controller {
        async  upload(ctx){
            let me=this;
            let docType=ctx.params.type;
            const stream = await ctx.getFileStream();
            let docName=path.basename(stream.filename);
            console.log(docName, docType);
            let filePath=await ctx.helper.saveFile(stream,docType).catch(function (error) {
                console.log('失敗啦啦啦啦啦啦啦啦')
                console.log(error);
                me.failure("上傳失敗");
                return;
            });
            //let docUrl='https://'+ctx.host+filePath;
            let docUrl=ctx.protocol+'://'+ctx.host+filePath;
            let doc=await ctx.model.Document.create({
                docUrl,
                docType,
                docName,
            });
            ctx.success("上傳成功!",doc);
        }
        async download(ctx){
            let id=ctx.params.id;
            let doc=await ctx.model.Document.findById(id);
            if(!doc){
                ctx.failure("下載失敗");
                return;
            }
            let filePath=doc.docUrl;
            ctx.attachment(doc.docName);
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.body = fs.createReadStream(filePath);
        }
    };
};
