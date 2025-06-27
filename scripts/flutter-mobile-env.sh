#!/bin/bash

# Script to create .env.development and .env.production in dart/apps/flutter_mobile

ENV_DIR="./../dart/apps/flutter_mobile"
DEV_ENV_FILE="$ENV_DIR/.env.development"
PROD_ENV_FILE="$ENV_DIR/.env.production"

# Ensure the directory exists
mkdir -p "$ENV_DIR"

# Function to create an env file if it doesn't exist
create_env_file() {
  local file_path="$1"
  if [ -f "$file_path" ]; then
    echo "$file_path already exists. Skipping."
  else
    echo "Creating $file_path"
    cat <<EOF > "$file_path"
EOF
    echo "$file_path created."
  fi
}

create_env_file "$DEV_ENV_FILE"
create_env_file "$PROD_ENV_FILE"

echo "Done."