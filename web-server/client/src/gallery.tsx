import React, { Fragment, useEffect, useRef } from 'react';
import cls from 'classnames';
import { codes } from './code';
import { projcet_info } from './env';
import { getParams } from './utils';
interface CodeInfo {
  fileName: string;
  fileIndex: number;
  code: string;
}
const { project_name, page_demo_number } = projcet_info;
const execute = (code: string, node: HTMLDivElement) => {
  const script = document.createElement('script');
  script.innerHTML = `
    try {
      ${code}
    } catch(e) {
      console.error(e);
    }
  `;
  node.appendChild(script);
};

const getAvailableCodes = () => {
  const pageIndex = getParams('page_index');
  if (!pageIndex) {
    return codes;
  }
  const startCodes = page_demo_number * Number(pageIndex);
  return codes.slice(startCodes, startCodes + page_demo_number);
};

const PlayGround: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const availableCodes = getAvailableCodes();

  useEffect(() => {
    availableCodes.forEach((item: CodeInfo) => {
      if (item) {
        execute(
          item.code
            .replace(/\(\*\*\)/g, '`')
            .replace(/\(_\*_\)/g, '\\n')
            .replace(/\(_\*\*_\)/g, '\\')
            .replace(/s1(\S*)s1/g, (_: any, sign: string) => {
              return '${' + sign + '}';
            }),
          document.querySelector(`#box-${item.fileIndex}`) as HTMLDivElement
        );
      }
    });
  }, []);

  return (
    <Fragment>
      <div
        className={cls('charts-container', {
          ['g-container']: project_name === 'G',
        })}
        data-length={codes.length}
        ref={containerRef}
      >
        {availableCodes.map((item: CodeInfo) => (
          <div
            key={item.fileName + item.fileIndex}
            id={`box-${item.fileIndex}`}
          >
            <div id={`container-${item.fileIndex}`}></div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

class ErrorHandlerPlayGround extends React.Component {
  state = {
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      // 你可以自定义降级后的 UI 并渲染
    }
    return <PlayGround {...this.props} />;
  }
}

// export default ErrorHandlerPlayGround;
export default ErrorHandlerPlayGround;
