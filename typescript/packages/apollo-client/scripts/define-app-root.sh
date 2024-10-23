#!/bin/bash

# Determine the .env file based on NODE_ENV
echo "NODE_ENV: $NODE_ENV"
if [ "$NODE_ENV" = "development" ]; then
    ENV_FILE=".env.development"
else
    ENV_FILE=".env.production"
fi

# Load the necessary environment variables from the corresponding .env file
if [ -f "$ENV_FILE" ]; then
    # Load environment variables
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "Error: Environment file '$ENV_FILE' does not exist."
    exit 1
fi

# Get the folder name from environment variables or prompt the user
if [ -z "$FOLDER_NAME" ]; then
    read -p "Please enter the name of the target folder: " FOLDER_NAME
fi

# Validate if the directory exists
if [ ! -d "../../apps/$FOLDER_NAME" ]; then
    echo "Error: Directory 'typescript/apps/$FOLDER_NAME' does not exist."
    exit 1
fi

# Get the absolute path to the folder
ABSOLUTE_PATH=$(realpath "../../apps/$FOLDER_NAME")

# Set and export DOCUMENTS and OUTPUT variables
export DOCUMENTS="$ABSOLUTE_PATH/src/gql/**/*.ts"
export OUTPUT="$ABSOLUTE_PATH/src/gql/__generated__"

# Create the index.ts file in the gql folder
INDEX_FILE="$ABSOLUTE_PATH/src/gql/index.ts"

# Add imports to the index.ts file
echo "Creating index.ts file..."

cat <<EOL > "$INDEX_FILE"
// Auto-generated index.ts file

// Import generated files
import * as base from './__generated__/base'
import * as types from './__generated__/types'

export * from './__generated__/operations'
export * from './__generated__/hooks'

export { base, types }
EOL

echo "index.ts file created at $INDEX_FILE"

# Run the codegen command
exec "$@"
