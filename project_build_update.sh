#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${DIR}
echo "Clean and restore project root"
dotnet clean
dotnet restore

echo "Update TRAISI.SDK"
cd ${DIR}/src/TRAISI.SDK
dotnet build -c cli

cd ${DIR}/src/TRAISI.SDK/Module
npm install
npm run build

echo "Update TRAISI.Questions"
cd ${DIR}/src/TRAISI.Questions
npm install
npm run staging

echo "Update TRAISI/ClientApp"
cd ${DIR}/src/TRAISI/ClientApp
npm install

echo "Build Project"
cd ${DIR}/src/TRAISI
dotnet build
