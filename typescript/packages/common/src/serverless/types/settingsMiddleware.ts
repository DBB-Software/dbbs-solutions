import { Context } from 'aws-lambda'
import { ISettingServiceClient } from '../../domain/types/setting-service-client.js'

/**
 * Custom context interface extending AWS Lambda context with a settings service.
 * This interface includes a settings service client instance.
 * @interface
 * @extends {Context}
 */
export interface ICustomSettingsContext extends Context {
  /** The settings service client instance for retrieving settings within the Lambda function. */
  settingsService: ISettingServiceClient
}

/**
 * Input parameters interface for the settings middleware.
 * @interface
 */
export interface ISettingsMiddlewareInput {
  /** The AWS region where the settings service is located. */
  region: string
  /** The endpoint URL of the settings service. */
  endpoint: string
  /** Optional parameter to enable AWS X-Ray tracing. Default is false. */
  enableXRay?: boolean
  /** The name of the service using the settings middleware. */
  serviceName: string
}
