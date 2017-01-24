#!/bin/sh

name=$1
url=$2
root=$3

echo $name
echo $url
echo $root

if [ -d "$root/$name" ];then
    cd "$root/$name"
    git pull origin master
else
    cd $root
    git clone $url $name
    cd $name
fi

sh build.sh