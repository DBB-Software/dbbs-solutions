#!/bin/bash

# Check if STAGE, AWS_PROFILE, and SECRET_PREFIX are set
if [ -z "$STAGE" ] || [ -z "$AWS_PROFILE" ] || [ -z "$SECRET_PREFIX" ]; then
  echo "Error: STAGE, AWS_PROFILE, and SECRET_PREFIX must be set."
  echo "Usage: STAGE=\"your-stage\" AWS_PROFILE=\"your-aws-profile\" SECRET_PREFIX=\"your-secret-prefix\" ./upload-env.sh"
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

for FOLDER in "${FOLDERS[@]}"
do
  ENV_FILE="$FOLDER/.env.$STAGE"
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist."
    continue
  fi

  echo "Processing folder: $FOLDER"

  SECRET_NAME="$SECRET_PREFIX/$STAGE/$FOLDER"

  # Convert the .env file to a JSON string
  SECRET_VALUE=$(jq -Rs 'split("\n") | map(select(length > 0)) | map(split("=") | {(.[0] | ltrimstr(" ")): .[1]}) | add' "$ENV_FILE")

  # Check if the secret already exists
  aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --profile "$AWS_PROFILE" &> /dev/null
  if [ $? -eq 0 ]; then
    echo "Updating secret: $SECRET_NAME"
    aws secretsmanager update-secret --secret-id "$SECRET_NAME" --secret-string "$SECRET_VALUE" --profile "$AWS_PROFILE" > /dev/null 2>&1
  else
    echo "Creating secret: $SECRET_NAME"
    aws secretsmanager create-secret --name "$SECRET_NAME" --secret-string "$SECRET_VALUE" --profile "$AWS_PROFILE" > /dev/null 2>&1
  fi
done

echo ".env files for $STAGE uploaded successfully."
