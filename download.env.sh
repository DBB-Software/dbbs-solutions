#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <STAGE>"
  exit 1
fi

STAGE=$1
FOLDERS=("apps/serverless-api" "apps/server-api" "apps/web-spa" "apps/web-ssr")
SECRET_SUFFIX="dbbs-platform"
ENV_FILE=".env"

echo "# $STAGE" > $ENV_FILE

for FOLDER in "${FOLDERS[@]}"
do
  echo "Processing folder: $FOLDER"

  SECRET_NAME="$SECRET_SUFFIX/$STAGE/$FOLDER"
  SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --profile dbbs-$1 | jq -r '.SecretString')

  echo -e "\n# $FOLDER" >> $ENV_FILE
  echo -e "${SECRET_VALUE%?}\n" | sed 's/":"/=/g; s/","/\n/g; s/{//g; s/}//g; s/"//g' >> $ENV_FILE
done
