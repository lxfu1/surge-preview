const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const { project_name } = require('./env');

// G 有多个目录，需要依次复制
if (project_name === 'G') {
  const fp = path.resolve('../../../G/packages');
  const scanDir = (foldPath, dir) => {
    try {
      const files = fs.readdirSync(foldPath);
      files.forEach((filename) => {
        const director = path.join(foldPath + '/', filename);
        const stats = fs.statSync(director);
        if (stats.isDirectory() && !director.includes('node_modules')) {
          scanDir(director, dir ? `${dir}.${filename}` : filename);
        }
        if (stats.isFile() && filename === 'index.umd.js') {
          const directorArray = director.split('/');
          const directorName = directorArray[directorArray.length - 3];
          shell.exec(`mkdir ../server/static/${directorName}`);
          shell.exec(`cp -r ${director} ../server/static/${directorName}`);
        }
      });
    } catch (err) {
      console.info(chalk.red(err));
    }
  };
  scanDir(fp);
} else if (project_name === 'ant-design-charts') {
  shell.exec(
    `cp -r ../../../${project_name}/packages/plots/dist/plots.min.js ../server/static`
  );
  shell.exec(
    `cp -r ../../../${project_name}/packages/maps/dist/maps.min.js ../server/static`
  );
  shell.exec(
    `cp -r ../../../${project_name}/packages/flowchart/dist/flowchart.min.js ../server/static`
  );
  shell.exec(
    `cp -r ../../../${project_name}/packages/graphs/dist/graphs.min.js ../server/static`
  );
} else {
  const lower_project_name = project_name.toLocaleLowerCase();
  // 复制本地 g2plot.min.js
  shell.exec(
    `cp -r ../../../${project_name}/dist/${lower_project_name}.min.js ../server/static`
  );
}

// 删除 server 静态文件
shell.exec('rm -rf ../server/static/assets');
// 复制当前打包文件
shell.exec('cp -r ./static/* ../server/static/');
