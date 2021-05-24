const shell = require('shelljs');

const move = () => {
  shell.exec('cp start.sh ./dist');
  shell.exec(
    'rsync -av --progress ./web-server ./dist --exclude */node_modules'
  );
};

move();
