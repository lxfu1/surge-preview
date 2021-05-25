const shell = require('shelljs');
const { project_name } = require('./env');

// 复制本地 g2plot.min.js
shell.exec(
  `cp -r ../../../${project_name}/dist/${project_name}.min.js ../server/static`
);
// 删除 server 静态文件
shell.exec('rm -rf ../server/static/assets');
// 复制当前打包文件
shell.exec('cp -r ./static/* ../server/static/');
