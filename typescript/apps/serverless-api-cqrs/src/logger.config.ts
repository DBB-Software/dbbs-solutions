import { FeatureFlagService, FeatureFlags } from '@dbbs/feature-config'
import {
  AWS_CLOUDWATCH_LOGS_GROUP,
  AWS_CLOUDWATCH_LOGS_PREFIX,
  AWS_CLOUDWATCH_REGION,
  AWS_S3_LOGS_BUCKET,
  AWS_S3_LOGS_FOLDER,
  AWS_S3_LOGS_REGION,
  LOGS_BUTCH_SIZE,
  LOGS_UPLOAD_INTERVAL_MS,
  LOG_LEVEL
} from './constants.js'

const featureFlagService = new FeatureFlagService()

let loggerTransports

if (featureFlagService.isEnabled(FeatureFlags.API_LOG_TRANSPORTS)) {
  loggerTransports = {
    targets: [
      {
        target: '@serdnam/pino-cloudwatch-transport',
        options: {
          logGroupName: AWS_CLOUDWATCH_LOGS_GROUP,
          awsRegion: AWS_CLOUDWATCH_REGION,
          logStreamName: AWS_CLOUDWATCH_LOGS_PREFIX,
          interval: LOGS_UPLOAD_INTERVAL_MS
        },
        level: LOG_LEVEL
      },
      {
        target: '@dbbs/s3-log-transport',
        options: {
          region: AWS_S3_LOGS_REGION,
          uploadInterval: LOGS_UPLOAD_INTERVAL_MS,
          batchSize: LOGS_BUTCH_SIZE,
          bucket: AWS_S3_LOGS_BUCKET,
          folder: AWS_S3_LOGS_FOLDER
        },
        level: LOG_LEVEL
      }
    ]
  }
}

export const loggerOptions = {
  pinoHttp: {
    transport: loggerTransports
  }
}
