const shell = require('shelljs');
const fs = require('fs');

const useStatic = async () => {
  const basePath = '../../public/preview';
  // 删除 preview 静态文件
  if (!fs.existsSync(basePath)) {
    shell.exec(`mkdir -p ${basePath}`);
  } else {
    shell.exec(`rm -rf ${basePath}/*`);
  }
  shell.exec(`cp -r ./static/* ${basePath}/`);
  process.exit();
};

module.exports = useStatic;
