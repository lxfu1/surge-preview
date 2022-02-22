const fs = require('fs');
const path = require('path');

const arg = process.argv.splice(2);

const [project_name, project_branch, build_command, tag = 'latest'] = arg;

const pageDemoNumber = 20;

fs.writeFileSync(
  path.resolve(__dirname, './env.js'),
  `const projcet_info = {
  project_name: '${project_name}',
  project_branch: '${project_branch}',
  build_command: '${build_command}',
  tag: '${tag}',
  page_demo_number: ${pageDemoNumber}
};\nmodule.exports = projcet_info;`
);

fs.writeFileSync(
  path.resolve(__dirname, '../src/env.ts'),
  `export const projcet_info = {
  project_name: '${project_name}',
  project_branch: '${project_branch}',
  build_command: '${build_command}',
  tag: '${tag}',
  page_demo_number: ${pageDemoNumber}
};`
);
