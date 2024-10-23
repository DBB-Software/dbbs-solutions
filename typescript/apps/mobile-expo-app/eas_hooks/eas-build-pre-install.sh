#!/usr/bin/env bash

# Read the yarn version from package.json
YARN_VERSION=$(node -e "console.log(require('../../../package.json').packageManager)")

# Activate yarn corepack
node -v
corepack enable
corepack prepare $YARN_VERSION --activate
