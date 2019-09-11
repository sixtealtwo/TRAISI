#!/usr/bin/env bash

update_npm () {
    if test -f "package.json"; then
        npm install
        npm run build
    fi
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${DIR}
echo "Clean and restore project root"
dotnet clean
dotnet restore

echo "Update TRAISI.SDK"
cd ${DIR}/src/TRAISI.SDK
dotnet build -c cli

cd ${DIR}/src/TRAISI.SDK/Module
update_npm

echo "Update TRAISI.Questions"
cd ${DIR}/src/TRAISI.Questions
if test -f "package.json"; then
    npm install
    npm run staging
fi

echo "Update TRAISI/ClientApp"
cd ${DIR}/src/TRAISI/ClientApp
update_npm

echo "Build Project"
cd ${DIR}/src/TRAISI
dotnet build
