#!/bin/sh

#nohup node /home/pi/get_weather/index.js &

FOREVER="./node_modules/forever/bin/forever"

sudo ${FOREVER} start index.js && sudo ${FOREVER} list

