#!/bin/sh
cd /home/tim/nodemanual.org
git pull origin master
git submodule update --init
npm install
node build.js
