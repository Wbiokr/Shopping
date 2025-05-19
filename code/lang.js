const OpenCC = require('opencc-js');
 
// 创建一个转换器实例，这里使用的是 s2t.js 文件，它是将简体转换为繁体的配置文件
// const converter = OpenCC.Converter(
//   { from: 'cn', to: 'tw' }
// );
 
// // 待转换的简体文本
// const simplifiedText = '你好，世界！汉语';
 
// // 转换文本
// const traditionalText = converter(simplifiedText);
 
// console.log(traditionalText); // 输出繁体文本


const fs = require('fs');
const path = require('path');

const converter = OpenCC.Converter(
  { from: 'cn', to: 'tw' }
);


/**
 * 递归替换目录中所有 HTML 和 JS 文件里的简体中文为指定字符串
 * @param {string} relativePath - 相对路径
 * @param {string} replacement - 替换字符串，默认为 '11111111111111'
 * @returns {Promise<void>}
 */
async function replaceSimplifiedChinese(relativePath) {
  const baseDir = path.resolve(process.cwd(), relativePath);
  
  // 验证目录是否存在
  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    throw new Error(`目录 "${baseDir}" 不存在或不是有效目录`);
  }
  
  // 简体中文字符范围（基本汉字）
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  
  // 递归处理目录
  async function processDirectory(dirPath) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // 递归处理子目录
        await processDirectory(entryPath);
      } else if (entry.isFile()) {
        // 检查文件扩展名
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.html' || ext === '.js' || ext === '.json' || ext === '.vue') {
          // 处理 HTML 或 JS 文件
          await processFile(entryPath);
        }
      }
    }
  }
  
  // 处理单个文件
  async function processFile(filePath) {
    try {
      // 读取文件内容
      let content = await fs.promises.readFile(filePath, 'utf8');
      
      // 替换简体中文
      // const newContent = content.replace(chineseRegex, converter);
      const newContent = converter(content)
      // 如果内容有变化，则写入文件
      if (newContent !== content) {
        await fs.promises.writeFile(filePath, newContent, 'utf8');
        console.log(`已替换: ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (err) {
      console.error(`处理文件 ${filePath} 时出错:`, err.message);
    }
  }
  
  // 开始处理目录
  await processDirectory(baseDir);
  console.log('替换完成!');
}

// 示例用法
replaceSimplifiedChinese('./server/app')
replaceSimplifiedChinese('./admin/src')
//   .catch(err => console.error('操作失败:', err));

module.exports = replaceSimplifiedChinese;    