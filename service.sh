#!/bin/sh

cmd=$1

if [ "$cmd" = 'start' ];then
    ./node_modules/.bin/forever start app.js
elif [ "$cmd" = 'stop' ]; then
    ./node_modules/.bin/forever stopall
else
    echo "sh service.sh [start|stop]"
fi
