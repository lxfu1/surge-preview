const fs = require('fs');
const puppeteer = require('puppeteer');
const delay = require('delay');
const chalk = require('chalk');
const compareImage = require('./compare');
const { getFormateDate } = require('./util');
const {
  chartLength,
  project_name,
  page_demo_number,
} = require('../static/code-info');

const renderTime = project_name === 'G' ? 60000 : 24000; // 确保图片能全部渲染完成
const singleChartHeight = project_name === 'G' ? 500 : 224; // 单个图表的高度，一行 4 个

const createBrowser = async () => {
  const dateString = getFormateDate();
  const basePath = `static/file/${dateString}`;
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const imageArray = new Array(Math.ceil(chartLength / page_demo_number))
    .fill('')
    .map((_, i) => i);
  console.log(chalk.green('\n****** 在线截图生成中 ******\n'));
  // 在线截图
  for (const i of imageArray) {
    const onlineBrowser = await puppeteer.launch();
    const onlinePage = await onlineBrowser.newPage();
    const viewHeight =
      project_name === 'G'
        ? Math.ceil(page_demo_number / 2) * singleChartHeight + 48
        : Math.ceil(page_demo_number / 4) * singleChartHeight + 48;
    await onlinePage.setViewport({
      width: 1440,
      height: viewHeight,
      deviceScaleFactor: 1,
    });
    await onlinePage.goto(`http://localhost:3000?page_index=${i}`);
    await delay(renderTime);
    const onlinePath = `${basePath}/online_${i}.png`;
    await onlinePage.screenshot({
      path: onlinePath,
    });

    await onlineBrowser.close();

    // 本地截图
    const localBrowser = await puppeteer.launch();
    const localPage = await localBrowser.newPage();
    await localPage.setViewport({
      width: 1440,
      height: viewHeight,
      deviceScaleFactor: 1,
    });
    await localPage.goto(`http://localhost:3000?type=local&page_index=${i}`);
    await delay(renderTime);
    const localPath = `${basePath}/local_${i}.png`;
    await localPage.screenshot({
      path: localPath,
    });
    await localBrowser.close();
    compareImage(
      onlinePath,
      localPath,
      basePath,
      i,
      i === imageArray.length - 1
    );
  }
};

module.exports = createBrowser;
