/**
 * Sets up and initializes the settings service, which is then attached to the context.
 * This middleware ensures that each request has access to the settings service, which can be used to retrieve tenant-specific settings.
 * @returns {Function} A middleware function that attaches the settings service to the context and continues the request-response cycle.
 */

import { LambdaClient } from '@aws-sdk/client-lambda'
import { SettingServiceClient } from '@dbbs/common'

function setupSettingsService() {
  const { REGION: region, SETTINGS_SERVICE_ENDPOINT: endpoint, SETTINGS_SERVICE_NAME: serviceName } = process.env

  if (!region) {
    throw new Error('region is not defined')
  }

  if (!endpoint) {
    throw new Error('endpoint is not defined')
  }

  if (!serviceName) {
    throw new Error('serviceName is not defined')
  }

  const lambdaClient = new LambdaClient({
    region,
    endpoint
  })

  return new SettingServiceClient(lambdaClient, serviceName)
}

const settingsService = setupSettingsService()

export default () => async (ctx, next) => {
  ctx.state.settingsService = settingsService

  await next()
}
