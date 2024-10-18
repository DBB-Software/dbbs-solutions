#!/usr/bin/env bash

app_name=$(basename "$PWD")

# Move to the root of the monorepo
cd ../../..

# Run yarn build for required packages in the root of the monorepo
echo "Running yarn build in the root of the monorepo"
yarn workspace @dbbs/mobile-components build
yarn workspace @dbbs/mobile-features build

# Move back to the app directory
cd "typescript/apps/$app_name"

echo "Returned to the app directory: apps/$app_name"
