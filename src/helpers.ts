import { exec } from '@actions/exec';

interface ExecSurgeCommandOptions {
  command: string[];
}

export const execSurgeCommand = async ({
  command,
}: ExecSurgeCommandOptions): Promise<void> => {
  let myOutput = '';
  const options = {
    listeners: {
      stdout: (stdoutData: Buffer) => {
        myOutput += stdoutData.toString();
      },
    },
  };
  await exec(`npx`, command, options);
  if (myOutput && !myOutput.includes('Success')) {
    throw new Error(myOutput);
  }
};

export const formatImage = ({
  buildingLogUrl,
  imageUrl,
}: {
  buildingLogUrl: string;
  imageUrl: string;
}) => {
  return `<a href="${buildingLogUrl}"><img width="300" src="${imageUrl}"></a>`;
};

export const getCommentFooter = () => {
  return '<sub>🤖 By [Surge Ui Insight](https://github.com/lxfu1/surge-preview)</sub>';
};

const addZero = (type: number) => {
  return `0${type}`;
};

export const getFormateDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month > 9 ? month : addZero(month)}-${
    day > 9 ? day : addZero(day)
  }`;
};
