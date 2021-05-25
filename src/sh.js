const shell = require('shelljs');
const core = require('@actions/core');

export const initPublic = async () => {
  return new Promise(async (resovle) => {
    const project_name = core.getInput('project_name') || 'G2Plot';
    const project_branch = core.getInput('project_branch') || 'master';
    core.info('surgeToken');
    shell.exec('mkdir tempPub');
    shell.exec(`ls`);
    shell.exec('cd ./tempPub');
    shell.exec(`ls`);
    shell.exec('git clone https://github.com/lxfu1/surge-preview.git');
    shell.exec(`ls`);
    shell.exec(`npx sh start.sh ${project_name} ${project_branch}`);
    shell.exec('cd ..');
    shell.exec(`mkdir pub`);
    shell.exec(`cp -r ../public/* ./pub`);
    shell.exec(`ls`);
    // shell.exec(`npx sh start.sh ${project_name} ${project_branch}`);
    // shell.exec(`ls ./pub/preview`);
    resovle(null);
  });
};
