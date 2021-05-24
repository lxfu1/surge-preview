const shell = require('shelljs')

const useStatic = async () => {
  // 删除 preview 静态文件
  shell.exec('rm -rf ../../public/preview/*');
  shell.exec('cp -r ./static/* ../../public/preview/');
  process.exit();
};

module.exports = useStatic;
