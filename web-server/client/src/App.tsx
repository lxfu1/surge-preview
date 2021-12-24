import React, { Fragment, useEffect, useState } from 'react';
import { get, find, isNumber, filter, isUndefined } from 'lodash';
import { projcet_info } from './env';
import Gallery from './gallery';
import { getMultiUrls } from './utils';
import './App.css';

type Type = 'online' | 'local';

const { project_name, project_branch, tag } = projcet_info;

const lower_project_name = project_name.toLocaleLowerCase();

/** 适用于一个构建产物 */
const EnvUrls = {
  online: `https://unpkg.com/@antv/${lower_project_name}@${tag}`,
  local: `/${lower_project_name}.min.js`,
};

const MultiEnvUrls = getMultiUrls(tag);

const getColorsInfo = (source: number[], target: number[]) => {
  let isEqual = true;
  let available = false;
  source.forEach((item: number, index: number) => {
    if (item || target[index]) {
      available = true;
    }
    if (item !== target[index]) {
      isEqual = false;
    }
  });
  return {
    available,
    isEqual,
  };
};

const getImageData = async (path: string): Promise<ImageData> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    img.src = path;
    img.style.display = 'none';
    canvas.style.display = 'none';
    img.onload = () => {
      const { width, height } = img;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, width, height));
      document.body.removeChild(img);
      document.body.removeChild(canvas);
    };
    document.body.appendChild(img);
    document.body.appendChild(canvas);
  });
};

const App: React.FC = () => {
  const [laoding, setLoading] = useState(true);
  const [diff, setDiff] = useState<string | number>('');
  const [showDiff, setShowDiff] = useState(false);
  const createLinks = () => {
    // 流程图需要 antd 依赖
    const { styles = [] } = MultiEnvUrls[project_name];
    const existLinks = document.getElementsByClassName('dynamic-link');
    if (existLinks.length) {
      Array.from(existLinks).forEach((exist) => {
        exist.parentNode?.removeChild(exist);
      });
    }
    const createLink = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.className = 'dynamic-link';
      link.href = src;
      document.getElementsByTagName('head')[0].appendChild(link);
    };
    styles.forEach((src) => {
      createLink(src);
    });
  };
  const createMultiScripts = async (type: 'online' | 'local' = 'online') => {
    const existScripts = document.getElementsByClassName('dynamic-scripts');
    if (existScripts.length) {
      Array.from(existScripts).forEach((exist) => {
        exist.parentNode?.removeChild(exist);
      });
    }
    const scripts = MultiEnvUrls[project_name][type];
    if (!scripts.length) {
      setLoading(false);
    }
    const orderScripts = filter(scripts, (item) => isNumber(item.order));
    orderScripts.sort((a, b) => {
      return get(a, 'order', 1) - get(b, 'order', 1);
    });
    const normalScripts = filter(
      scripts,
      (item) => isUndefined(item.order) || !isNumber(item.order)
    );
    const loaderScript = (src: string, callback: Function) => {
      // 动态创建 script
      const script = document.createElement('script');
      script.src = src;
      script.className = 'dynamic-scripts';
      script.onload = function () {
        callback(src);
      };
      script.onerror = function () {
        callback(src);
      };
      document.getElementsByTagName('body')[0].appendChild(script);
    };
    const createPromise = (src: string) => {
      return new Promise((resolve, reject) => {
        // 动态创建 script
        loaderScript(src, resolve);
      });
    };
    const promisePool: Promise<any>[] = [];
    const orderPromisePool: { [key: string]: Promise<any>[] } = {};
    orderScripts.forEach(({ order }) => {
      if (!orderPromisePool[`order-${order}`]) {
        orderPromisePool[`order-${order}`] = [];
      }
    });
    const orderKeys = Object.keys(orderPromisePool);
    /** 依赖 order 先加载关系 */
    const loadNormal = () => {
      /** 依赖 order 先加载关系 */
      normalScripts.forEach(({ src }) => {
        promisePool.push(createPromise(src));
      });
      Promise.all(promisePool).then((v) => {
        setLoading(false);
      });
    };
    if (orderKeys.length) {
      for (let i = 0; i < orderKeys.length; i++) {
        const orderKey = orderKeys[i];
        const currentScripts: Promise<any>[] = [];
        orderScripts.forEach(({ src, order }) => {
          if (Number(orderKey.split('-')[1]) === order) {
            currentScripts.push(createPromise(src));
          }
        });
        await Promise.all(currentScripts);
        if (Object.keys(orderPromisePool).length - 1 === i) {
          loadNormal();
        }
      }
    } else {
      loadNormal();
    }
  };
  const createScript = (type: string) => {
    const exist = document.getElementById('dynamic-scripts');
    if (exist) {
      exist.parentNode?.removeChild(exist);
    }
    // 动态创建 script
    let script = document.createElement('script');
    script.src = type === 'local' ? EnvUrls.local : EnvUrls.online;
    script.id = 'dynamic-scripts';
    script.onload = function () {
      setLoading(false);
    };
    script.onerror = function () {
      setLoading(false);
    };
    document.getElementsByTagName('body')[0].appendChild(script);
  };
  const getParams = (key: string) => {
    const param = window.location.search.split('?')[1]?.split('&') || [];
    const params: { [key: string]: string } = {};
    param.forEach((item: string) => {
      const [key, value] = item.split('=');
      params[key] = value;
    });
    return params[key];
  };
  useEffect(() => {
    // 查看 diff 结果
    const type = getParams('type');
    if (type === 'diff') {
      setLoading(false);
      setShowDiff(true);
    } else {
      if (MultiEnvUrls[project_name]) {
        createLinks();
        createMultiScripts(type as Type);
      } else {
        createScript(type);
      }
    }
  }, []);

  const caculateDiff = async () => {
    const basePath = `/file/${getParams('date')}`;
    const { data: localData } = await getImageData(`${basePath}/local.png`);
    const { data: onlineData } = await getImageData(`${basePath}/online.png`);
    let diffLength = 0;
    let availableDataLength = 0;
    const dataLength = localData.length;
    for (let i = 0; i < dataLength; i += 4) {
      const currentLocalData = [
        localData[i],
        localData[i + 1],
        localData[i + 2],
        localData[i + 3],
      ];
      const currentOnlineData = [
        onlineData[i],
        onlineData[i + 1],
        onlineData[i + 2],
        onlineData[i + 3],
      ];
      const { available, isEqual } = getColorsInfo(
        currentLocalData,
        currentOnlineData
      );
      if (available) {
        availableDataLength += 1;
      }
      if (!isEqual) {
        diffLength += 1;
      }
    }
    if (!availableDataLength) {
      availableDataLength = 1;
    }
    setDiff((diffLength * 100) / Math.ceil(availableDataLength / 4));
  };

  useEffect(() => {
    if (showDiff) {
      caculateDiff();
    }
  }, [showDiff]);

  if (laoding) {
    return <div className="loading">脚本加载中</div>;
  }

  if (showDiff) {
    const basePath = `/file/${getParams('date')}`;
    return (
      <div className="box">
        <div className="diff-info">
          <span>当前分支：{project_branch}</span>
          <span style={{ fontWeight: 'bold' }}>
            差异度：
            {typeof diff === 'string' ? (
              <span style={{ color: 'green' }}>计算中...</span>
            ) : (
              <span style={{ color: 'red' }}>{diff.toFixed(2)}%</span>
            )}
          </span>
          <span>线上CDN</span>
        </div>
        <div className="diff-box">
          <img src={`${basePath}/local.png`} alt="local" />
          <img src={`${basePath}/diff.png`} alt="diff" />
          <img src={`${basePath}/online.png`} alt="online" />
        </div>
      </div>
    );
  }

  return <Gallery />;
};

export default App;
