#!/bin/sh

git add .
git commit -m \"Updates\"
npm version patch
npm run build 
npm publish