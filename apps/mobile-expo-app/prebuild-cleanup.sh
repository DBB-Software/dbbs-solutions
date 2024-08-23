#!/bin/bash

# 1. Remove the react dependency from package.json
# We will do this by using a temporary file without the react dependency

echo "Removing the react dependency from package.json..."

# Use jq for safe removal of the dependency
jq 'del(.dependencies.react)' package.json > temp.json && mv temp.json package.json

echo "The react dependency has been successfully removed."

# 2. Remove the DetoxTests.java file,
# the detox template creates a java file that is not needed for this project and is redundant,
# we already use DetoxTest.kt

# Define the root directory to search for DetoxTests.java
ANDROID_TESTS_ROOT_DIR="android/app/src/androidTest/java/com"

# Find and remove DetoxTests.java file
find "$ANDROID_TESTS_ROOT_DIR" -type f -name "DetoxTest.java" -exec rm {} \; -print

# Done
echo "Script executed successfully."
