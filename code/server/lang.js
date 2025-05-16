const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc');

const converter = new OpenCC('s2t.json'); // s2t.json 表示简体转繁体

function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const convertedContent = converter.convertSync(content);
  fs.writeFileSync(filePath, convertedContent, 'utf8');
}

function traverseDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (path.extname(fullPath) === '.js' || path.extname(fullPath) === '.css') {
      convertFile(fullPath);
    }
  });
}

const projectDir = './your-project-directory'; // 替换为你的项目目录
traverseDirectory(projectDir);