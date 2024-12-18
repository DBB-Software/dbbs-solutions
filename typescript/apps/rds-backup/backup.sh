#!/bin/bash
set -e

# Usage: ./backup.sh <db-connection-string> <backup-file-path>

echo "starting backing up"

# Variables (customize these as needed)
DB_CONNECTION_STRING=$1 # format "postgresql://user:password@host:port/dbname"
BACKUP_FILE=$2 # use /tmp folder for running in AWS lambda

echo $DB_CONNECTION_STRING
echo $BACKUP_FILE

# Create the database dump
echo "Creating database dump..."
export LD_LIBRARY_PATH="./postgres-16.3" # needed for usage in AWS lambda
./postgres-16.3/pg_dump -Z 9 -v -d $DB_CONNECTION_STRING > $BACKUP_FILE

echo "Backup created at $BACKUP_FILE"
