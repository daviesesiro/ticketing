#!/bin/sh
cd auth
echo "Starting auth tests"
yarn test

cd ../tickets
echo "Starting tickets tests"
yarn test