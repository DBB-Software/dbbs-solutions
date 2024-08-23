/**
 * Module representing logger configuration.
 * @module LoggerConfig
 */

import { FeatureFlagService, FeatureFlags } from '@dbbs/feature-config'
import { ILoggerOptions } from '@dbbs/nestjs-module-logger'
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
import { asyncContextStorage } from './asyncContextStorage.js'

/**
 * Represents the logger configuration options.
 * @typedef {ILoggerOptions} LoggerOptions
 * @property {Object} pinoHttp - Configuration options for Pino HTTP logger.
 * @property {Object} asyncContext - Configuration options for asynchronous context storage.
 */

/**
 * Creates logger transports based on feature flags.
 * @type {Object}
 */
let loggerTransports

/**
 * Feature flag service instance.
 * @type {FeatureFlagService}
 */
const featureFlagService = new FeatureFlagService()

/**
 * Checks if API log transports feature flag is enabled.
 * If enabled, sets up logger transports.
 */
if (featureFlagService.isEnabled(FeatureFlags.API_LOG_TRANSPORTS)) {
  loggerTransports = {
    targets: [
      {
        target: 'pino-cloudwatch',
        options: {
          group: AWS_CLOUDWATCH_LOGS_GROUP,
          aws_region: AWS_CLOUDWATCH_REGION,
          prefix: AWS_CLOUDWATCH_LOGS_PREFIX,
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

/**
 * Configuration options for logger.
 * @type {LoggerOptions}
 */
export const loggerOptions: ILoggerOptions = {
  pinoHttp: {
    transport: loggerTransports
  },
  asyncContext: asyncContextStorage
}
