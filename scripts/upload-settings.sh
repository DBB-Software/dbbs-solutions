#!/bin/bash

source ./scripts/env-constants.sh

if [ -z "$AWS_PROFILE" ]; then
    echo "Error: AWS_PROFILE environment variable is not set."
    exit 1
fi

if [ -z "$SETTINGS_S3_BUCKET_NAME" ]; then
    echo "Error: SETTINGS_S3_BUCKET_NAME environment variable is not set."
    exit 1
fi

sync_settings() {
    local env=$1
    echo "Syncing $env settings to S3 bucket $SETTINGS_S3_BUCKET_NAME using profile $AWS_PROFILE..."
    aws s3 sync packages/settings/"$env" s3://"$SETTINGS_S3_BUCKET_NAME"/"$env" --profile "$AWS_PROFILE"
}

for env in "${ENVIRONMENTS[@]}"; do
    sync_settings "$env"
done
