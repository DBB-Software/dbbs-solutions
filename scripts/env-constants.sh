#!/bin/bash

# Define a list of environment names
readonly ENVIRONMENTS=("local" "development" "production" "staging")

# Define the AWS profile (default value)
AWS_PROFILE="${AWS_PROFILE:-default-aws-profile}"

# Define the secret prefix or namespace (default value)
SECRET_PREFIX="${SECRET_PREFIX:-dbbs-pre-built-solutions}"

# Define the stage (default value)
STAGE="${STAGE:-default-stage}"

# Define the S3 bucket name (default value)
SETTINGS_S3_BUCKET_NAME="${SETTINGS_S3_BUCKET_NAME:-default-s3-bucket-name}"
