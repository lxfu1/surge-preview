const shell = require('shelljs');
const fs = require('fs');

const useStatic = async () => {
  // 删除 preview 静态文件
  if (!fs.existsSync('../../public/preview/')) {
    shell.exec('mkdir -p ../../public/preview');
  } else {
    shell.exec('rm -rf ../../public/preview/*');
  }
  shell.exec('cp -r ./static/* ../../public/preview/');
  process.exit();
};

module.exports = useStatic;
