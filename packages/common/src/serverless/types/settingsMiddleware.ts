import { Context } from 'aws-lambda'
import { ISettingServiceClient } from '../../domain/types/setting-service-client.js'

export interface ICustomSettingsContext extends Context {
  settingsService: ISettingServiceClient
}

export interface ISettingsMiddlewareInput {
  region: string
  endpoint: string
  enableXRay?: boolean
  serviceName: string
}
