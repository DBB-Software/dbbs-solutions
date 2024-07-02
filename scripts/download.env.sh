#!/bin/bash

# Check if STAGE is set
if [ -z "$STAGE" ]; then
  echo "Error: STAGE must be set."
  echo "Usage: STAGE=\"your-stage\" AWS_PROFILE=\"your-aws-profile\" SECRET_PREFIX=\"your-secret-prefix\" ./download.env.sh"
  exit 1
fi

FOLDERS=("apps/serverless-api" "apps/server-api" "apps/web-spa" "apps/web-ssr" "apps/strapi" "apps/serverless-settings-service")
ENV_FILE=".env"

echo "# $STAGE" > $ENV_FILE

for FOLDER in "${FOLDERS[@]}"
do
  echo "Processing folder: $FOLDER"

  SECRET_NAME="$SECRET_PREFIX/$STAGE/$FOLDER"
  SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --profile $AWS_PROFILE | jq -r '.SecretString')

  echo "$SECRET_VALUE" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > "$FOLDER/.env.$STAGE"
done
