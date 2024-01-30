#!/bin/bash

notify_url="$1"
title="$2"
release_version="$3"
download_link="$4"
release_notes="$5"

# Escape backslash
escaped_release_notes=${release_notes//\\/\\\\}
# Escape double quotes
escaped_release_notes=${release_notes//\"/\\\"}

body_template="
  <h2>Version $release_version: <a href='$download_link' style='color:black;'>download</a></h2>
  <h3>Release Notes</h3><br/>
  <p>$escaped_release_notes</p>
"

data="{\"@type\": \"MessageCard\", \"@context\": \"http://schema.org/extensions\", \"summary\": \"$title\", \"title\": \"$title\", \"sections\": [{ \"text\": \"$body_template\"}]}"
tmpfile=$(mktemp)
response_code=$(curl -X POST -H "Content-Type: application/json" --data "$data" -s -o "$tmpfile" -w "%{http_code}" $notify_url)

if [ "$response_code" != "200" ]; then
  echo "error sending message"
  echo "Response: $(cat "$tmpfile")"
  exit 1
else
  echo "Message sent"
  echo "Response: $(cat "$tmpfile")"
fi
