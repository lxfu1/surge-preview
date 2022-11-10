#!/usr/bin/env bash
export PATH=$PATH:/bin:/sbin:/usr/bin:/usr/sbin::/usr/local/bin
# set -e;

echo $PATH

# project_name=surge-preview

project_name=$1

project_branch=$2

dist_command=$3

tag=$4

echo "\033[49;32m \n******* installing pnpm *******\n \033[0m"

ls

npm i pnpm@latest -g

pwd

cd ..

pwd

echo "\033[49;32m \n******* ${project_name} cloning *******\n \033[0m"

# if [ ${project_name} = 'ant-design-charts' ];then
#   git clone -b ${project_branch} https://github.com/ant-design/ant-design-charts.git
# else
#   pwd
#   git clone -b ${project_branch} https://github.com/antvis/${project_name}.git
# fi

# pwd

# ls

# cd ./${project_name}

pwd

ls

echo "\033[49;32m \n******* ${project_name} installing *******\n \033[0m"

pnpm i

echo "\033[49;32m \n******* ${project_name} building with ${dist_command} *******\n \033[0m"

pwd

if [ ${project_name} = 'G' ];then
    pnpm build
    pnpm ${dist_command}
else
    pnpm run ${dist_command}
fi

cd ./surge-preview/web-server/client

pwd

echo "\033[49;32m \n******* set env *******\n \033[0m"

ls

node scripts/set-env.js ${project_name} ${project_branch} ${dist_command} ${tag}

echo "\033[49;32m \n******* client installing *******\n \033[0m"

pnpm -v

pnpm i

echo "\033[49;32m \n******* client building *******\n \033[0m"

pnpm run build

cd ../server

echo "\033[49;32m \n******* server installing *******\n \033[0m"

pnpm i

echo "\033[49;32m \n******* server starting *******\n \033[0m"

pnpm start
