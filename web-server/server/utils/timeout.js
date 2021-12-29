const createError = require('http-errors');

const koa2Timeout = (delay) =>
  async function (ctx, next) {
    var tmr = null;
    const timeout = delay;
    await Promise.race([
      new Promise(function (resolve, reject) {
        tmr = setTimeout(function () {
          reject(createError(408, 'Request timeout'));
        }, timeout);
      }),
      new Promise(function (resolve, reject) {
        //使用一个闭包来执行下面的中间件
        (async function () {
          await next();
          clearTimeout(tmr);
          resolve();
        })();
      }),
    ]);
  };

module.exports = koa2Timeout;
