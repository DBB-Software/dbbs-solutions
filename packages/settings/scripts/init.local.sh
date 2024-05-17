#!/bin/bash

awslocal s3api create-bucket --bucket dbbs-settings-local --create-bucket-configuration LocationConstraint=eu-central-1 || true
awslocal s3 cp local/settings.json s3://dbbs-settings-local/settings.json
