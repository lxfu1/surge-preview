const shell = require('shelljs');
const core = require('@actions/core');

(() => {
  const project_name = core.getInput('project_name') || 'G2Plot';
  const project_branch = core.getInput('project_branch') || 'master';
  shell.exec(`npx sh start.sh ${project_name} ${project_branch}`);
  shell.exec(`ls ./public/preview`);
  return;
})();
