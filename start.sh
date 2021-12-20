#!/usr/bin/env bash
export PATH=$PATH:/bin:/sbin:/usr/bin:/usr/sbin::/usr/local/bin
# set -e;

echo $PATH

# project_name=surge-preview

project_name=$1

project_branch=$2

dist_command=$3

tag=$4

pwd

cd ~

echo "~ path"

pwd

cd /

echo "/ path"

pwd

cd ..

pwd

echo "\033[49;32m \n******* ${project_name} cloning *******\n \033[0m"

git clone -b ${project_branch} https://github.com/antvis/${project_name}.git

cd ./${project_name}

echo "\033[49;32m \n******* ${project_name} installing *******\n \033[0m"

yarn

echo "\033[49;32m \n******* ${project_name} building with ${dist_command} *******\n \033[0m"

pwd

# if [ ${project_name} = 'G' ];then
#     yarn build
#     yarn ${dist_command}
# else
#     yarn run ${dist_command}
# fi

yarn run ${dist_command}

cd ../surge-preview/web-server/client

pwd

echo "\033[49;32m \n******* set env *******\n \033[0m"

ls

node scripts/set-env.js ${project_name} ${project_branch} ${dist_command} ${tag}

echo "\033[49;32m \n******* client installing *******\n \033[0m"

yarn

echo "\033[49;32m \n******* client building *******\n \033[0m"

yarn run build

cd ../server

echo "\033[49;32m \n******* server installing *******\n \033[0m"

yarn

echo "\033[49;32m \n******* server starting *******\n \033[0m"

yarn start
