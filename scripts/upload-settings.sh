#!/bin/bash

source ./scripts/env-constants.sh

sync_settings() {
    local env=$1
    echo "Syncing $env settings to S3..."
    aws s3 sync packages/settings/"$env" s3://development-packages-settings/"$env"
}

for env in "${ENVIRONMENTS[@]}"; do
    sync_settings "$env"
done
