import React, { Fragment, useEffect, useState } from 'react';
import { projcet_info } from './env';
import Gallery from './gallery';
import './App.css';

const { project_name, project_branch } = projcet_info;

const lower_project_name = project_name.toLocaleLowerCase();

const EnvUrls = {
  online: `https://unpkg.com/@antv/${lower_project_name}@latest`,
  local: `/${lower_project_name}.min.js`,
};

const isEqual = (source: number[], target: number[]) => {
  let result = true;
  source.forEach((item: number, index: number) => {
    if (item !== target[index]) {
      result = false;
    }
  });
  return result;
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
  const createScripts = (type: string) => {
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
      // @ts-ignore
      window[lower_project_name] = project_name;
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
      createScripts(type);
    }
  }, []);

  const caculateDiff = async () => {
    const basePath = `/file/${getParams('date')}`;
    const { data: localData } = await getImageData(`${basePath}/local.png`);
    const { data: onlineData } = await getImageData(`${basePath}/online.png`);
    let diffLength = 0;
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
      if (!isEqual(currentLocalData, currentOnlineData)) {
        diffLength += 1;
      }
    }
    setDiff((diffLength * 100) / Math.ceil(dataLength / 4));
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
