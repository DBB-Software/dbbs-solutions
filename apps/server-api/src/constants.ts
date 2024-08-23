export const LOGS_UPLOAD_INTERVAL_MS = 3000
export const LOGS_BUTCH_SIZE = 10
export const { NODE_ENV } = process.env
export const LOG_LEVEL = NODE_ENV === 'production' ? 'error' : undefined
export const { AWS_CLOUDWATCH_REGION, AWS_S3_LOGS_REGION, AWS_S3_LOGS_FOLDER } = process.env
export const { AWS_S3_LOGS_BUCKET } = process.env
export const { AWS_CLOUDWATCH_LOGS_PREFIX } = process.env
export const AWS_CLOUDWATCH_LOGS_GROUP = process.env.AWS_CLOUDWATCH_LOGS_GROUP || 'default'
export const { REGION = 'eu-central-1' } = process.env
export const {
  SETTINGS_SERVICE_ENDPOINT = 'http://localhost:3032',
  SETTINGS_SERVICE_NAME = 'serverless-settings-service-local-getSettings'
} = process.env

export const SETTINGS_SERVICE_ENABLE_XRAY = false
