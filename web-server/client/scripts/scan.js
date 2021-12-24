const fs = require('fs');
const path = require('path');
const { transform, registerPlugin } = require('@babel/standalone');
const { project_name } = require('./env');
const {
  filterG2Plot,
  filterG2,
  filterG,
  filterAntDesignCharts,
} = require('./filter');
const basePath = '../../../';
const specialProject = ['G', 'ANT-DESIGN-CHARTS'];
const fp = path.resolve(
  basePath,
  specialProject.includes(project_name)
    ? `${project_name}/packages/site/examples`
    : `${project_name}/examples`
);
const codePath = path.resolve('./src');

const codes = [];
let index = 0;
const codeGenerator = () => {
  fs.writeFileSync(
    path.resolve(__dirname, codePath, `code.ts`),
    `export const codes = [${codes}]`
  );
};

const setCodesLength = () => {
  //  用于计算浏览器高度
  fs.writeFileSync(
    path.resolve(__dirname, '../../server/static/code-info.js'),
    `module.exports = {chartLength: ${
      index + 1
    }, project_name: '${project_name}'};`,
    'utf8'
  );
};

// 不同库过滤函数不一样
const filterCode = (code) => {
  if (project_name === 'G2Plot') {
    return filterG2Plot(code, index);
  }
  if (project_name === 'G2') {
    return filterG2(code, index);
  }
  if (project_name === 'G') {
    return filterG(code, index);
  }
  if (project_name === 'ANT-DESIGN-CHARTS') {
    return filterAntDesignCharts(code, index);
  }
  return code;
};

// 特殊文件不做处理
const specialFile = ['arrow.js'];

const scanFiles = (foldPath, dir) => {
  try {
    const files = fs.readdirSync(foldPath);
    files.forEach((fileName) => {
      const director = path.join(foldPath + '/', fileName);
      const stats = fs.statSync(director);
      if (stats.isDirectory()) {
        scanFiles(director, dir ? `${dir}.${fileName}` : fileName);
      }
      if (
        stats.isFile() &&
        (fileName.endsWith('.ts') || fileName.endsWith('.js')) &&
        !fileName.includes('.d.ts')
      ) {
        const filePath = path.resolve(
          __dirname,
          basePath,
          specialProject.includes(project_name)
            ? `../${project_name}/packages/site/examples`
            : `../${project_name}/examples`,
          dir.split('.').join('/'),
          fileName
        );
        if (specialFile.includes(fileName)) {
          return;
        }
        const { code } = transform(fs.readFileSync(filePath, 'utf-8'), {
          filename: fileName,
          presets: ['react', 'typescript', 'es2015'],
          plugins: ['transform-modules-umd'],
        });
        const fcode = filterCode(code);
        codes.push(
          `{fileName: "${fileName}", fileIndex: ${index}, code: ` +
            '`' +
            fcode +
            '`}'
        );

        index += 1;
      }
    });
    codeGenerator();
    setCodesLength();
  } catch (err) {
    console.log(err);
  }
};

scanFiles(fp);
