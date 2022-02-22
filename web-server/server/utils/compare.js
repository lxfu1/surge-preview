const fs = require('fs');
const chalk = require('chalk');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const useStatic = require('./preview');

const compareImage = (path1, path2, basePath, index, finished) => {
  const img1 = PNG.sync.read(fs.readFileSync(path1));
  const img2 = PNG.sync.read(fs.readFileSync(path2));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });
  const diffPath = `${basePath}/diff_${index}.png`;
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  if (finished) {
    console.log(chalk.green('\n****** 截图比对完成 ******\n'));
    useStatic();
  }
};

module.exports = compareImage;
