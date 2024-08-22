#!/bin/bash

# Check if STAGE, AWS_PROFILE, and SECRET_PREFIX are set
if [ -z "$STAGE" ] || [ -z "$AWS_PROFILE" ] || [ -z "$SECRET_PREFIX" ]; then
  echo "Error: STAGE, AWS_PROFILE, and SECRET_PREFIX must be set."
  echo "Usage: STAGE=\"your-stage\" AWS_PROFILE=\"your-aws-profile\" SECRET_PREFIX=\"your-secret-prefix\" ./download.env.sh"
  exit 1
fi

# Path to the app folders configuration file
APP_FOLDERS_FILE="./scripts/app-folders.conf"

# Check if the app folders configuration file exists
if [ ! -f "$APP_FOLDERS_FILE" ]; then
  echo "Error: $APP_FOLDERS_FILE does not exist."
  exit 1
fi

# Read the list of folders from the configuration file
FOLDERS=()
while IFS= read -r line || [[ -n "$line" ]]; do
  FOLDERS+=("$line")
done < "$APP_FOLDERS_FILE"

ENV_FILE=".env"

echo "# $STAGE" > $ENV_FILE

for FOLDER in "${FOLDERS[@]}"
do
  echo "Processing folder: $FOLDER"

  SECRET_NAME="$SECRET_PREFIX/$STAGE/$FOLDER"
  SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --profile $AWS_PROFILE 2>/dev/null | jq -r '.SecretString')

  if [ $? -ne 0 ] || [ -z "$SECRET_VALUE" ]; then
    echo "Warning: Secret $SECRET_NAME not found or empty. Skipping..."
    continue
  fi

  echo "$SECRET_VALUE" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > "$FOLDER/.env.$STAGE"
done

echo "Secrets downloaded successfully."
