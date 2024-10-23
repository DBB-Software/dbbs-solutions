import middy, { MiddlewareObj } from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SettingServiceClient } from '../domain/setting-service-client.js'
import { ICustomSettingsContext, ISettingsMiddlewareInput } from './types/settingsMiddleware.js'

/**
 * Middleware function for integrating the settings service into the AWS Lambda context.
 * @param {ISettingsMiddlewareInput} params - The parameters for configuring the middleware.
 * @returns {MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult, Error, ICustomSettingsContext>} The settings middleware.
 */
export function settingsMiddleware({
  region,
  endpoint,
  serviceName,
  enableXRay = false
}: ISettingsMiddlewareInput): MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Error,
  ICustomSettingsContext
> {
  const settingsService = new SettingServiceClient({
    region,
    endpoint,
    settingsFunctionName: serviceName,
    enableXRay
  })

  const settingsMiddlewareBefore: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Error,
    ICustomSettingsContext
  > = async ({ context }: { context: ICustomSettingsContext }): Promise<void> => {
    context.settingsService = settingsService
  }

  return {
    before: settingsMiddlewareBefore
  }
}
