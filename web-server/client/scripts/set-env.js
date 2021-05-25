const fs = require('fs');
const path = require('path');

const arg = process.argv.splice(2);

const [project_name, project_branch, build_command] = arg;

fs.writeFileSync(
  path.resolve(__dirname, './env.js'),
  `const projcet_info = {
  project_name: '${project_name}',
  project_branch: '${project_branch}',
  build_command: '${build_command}',
};\nmodule.exports = projcet_info;`
);

fs.writeFileSync(
  path.resolve(__dirname, '../src/env.ts'),
  `export const projcet_info = {
  project_name: '${project_name}',
  project_branch: '${project_branch}',
  build_command: '${build_command}',
};`
);
