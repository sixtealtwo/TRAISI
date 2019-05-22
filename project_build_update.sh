#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${DIR}
dotnet clean
dotnet restore

cd ${DIR}/src/TRAISI.SDK
dotnet build -c cli

cd ${DIR}/src/TRAISI.SDK/Module
npm install
npm run build

cd ${DIR}/src/TRAISI.Questions
npm install
npm run staging

cd ${DIR}/src/TRAISI/ClientApp
npm install

cd ${DIR}/src/TRAISI
dotnet build