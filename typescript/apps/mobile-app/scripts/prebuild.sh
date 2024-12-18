#!/bin/bash

# Determine the .env file based on NODE_ENV
if [ "$NODE_ENV" = "development" ]; then
    ENV_FILE=".env.development"
else
    ENV_FILE=".env.production"
fi

# Load the necessary environment variables from the corresponding .env file
if [ -f "$ENV_FILE" ]; then
    echo "ENV_FILE: $ENV_FILE found."
    export $(grep -E 'SENTRY_AUTH_TOKEN|SENTRY_ORG_NAME|SENTRY_ORG_PROJECT' "$ENV_FILE" | xargs)
else
    echo "$ENV_FILE not found."
    exit 1
fi

# Function to update or create the sentry.properties file
update_or_create_sentry_file() {
    local FILE_PATH=$1

    # Check if the file exists
    if [ -f "$FILE_PATH" ]; then
        # Replace existing values in the sentry.properties file
        sed -i "" "s/^defaults\.project=.*/defaults.project=${SENTRY_ORG_PROJECT}/" "$FILE_PATH"
        sed -i "" "s/^auth\.token=.*/auth.token=${SENTRY_AUTH_TOKEN}/" "$FILE_PATH"
        sed -i "" "s/^defaults\.org=.*/defaults.org=${SENTRY_ORG_NAME}/" "$FILE_PATH"
        
        # Ensure that the defaults.url is always set
        if grep -q "^defaults\.url=" "$FILE_PATH"; then
            sed -i "" "s/^defaults\.url=.*/defaults.url=https:\/\/sentry.io/" "$FILE_PATH"
        else
            echo "defaults.url=https://sentry.io" >> "$FILE_PATH"
        fi
    else
        # Create a new file with the necessary values
        cat <<EOL > "$FILE_PATH"
defaults.url=https://sentry.io
defaults.org=${SENTRY_ORG_NAME}
defaults.project=${SENTRY_ORG_PROJECT}
auth.token=${SENTRY_AUTH_TOKEN}
EOL
    fi
}

# Update or create the sentry.properties files for Android and iOS
update_or_create_sentry_file "./android/sentry.properties"
update_or_create_sentry_file "./ios/sentry.properties"

exec "$@"
