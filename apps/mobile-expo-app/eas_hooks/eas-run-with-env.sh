#!/usr/bin/env bash

echo "Running with environment: $NODE_ENV"

if [ "$NODE_ENV" == "deveplopment" ]; then
  # Export variables from .env.development
  export $(grep -v '^#' .env.development | xargs)
else
  # Export variables from .env.production
  export $(grep -v '^#' .env.production | xargs)
fi

exec "$@"