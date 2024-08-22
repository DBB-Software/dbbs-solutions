import { Inject, Injectable, Param } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { SettingServiceClient } from '@dbbs/common'
import { LambdaClient } from '@aws-sdk/client-lambda'
import { ISettingsResponse, ISettingsServiceOptions } from './interfaces.js'
import { SETTINGS_SERVICE_PROVIDER } from './constants.js'

/**
 * Service for handling tenant settings.
 */
@Injectable()
export class SettingsService {
  settingsServiceClient: SettingServiceClient

  lambdaClient: LambdaClient

  /**
   * Constructs an instance of SettingsService.
   * @param {ISettingsServiceOptions} opts - Options for configuring the settings service.
   * @param {Logger} logger - The logger instance injected via dependency injection.
   */
  constructor(
    @Inject(SETTINGS_SERVICE_PROVIDER) private readonly opts: ISettingsServiceOptions,
    @InjectLogger(SettingsService.name) private readonly logger: Logger
  ) {
    const { region, endpoint, serviceName, enableXRay } = this.opts

    this.settingsServiceClient = new SettingServiceClient({
      region,
      endpoint,
      settingsFunctionName: serviceName,
      enableXRay
    })
  }

  /**
   * Retrieves all settings for all tenants.
   * @returns {Promise<ISettingsResponse>} Object containing settings for all tenants.
   */
  async getAllTenantSettings(): Promise<ISettingsResponse> {
    this.logger.info('Get all settings')

    const settings = await this.settingsServiceClient.getAllTenantSettings()

    return settings
  }

  /**
   * Retrieves settings for a specific tenant.
   * @param {string} tenant Identifier of the tenant.
   * @returns {Promise<ISettingsResponse>} Object containing settings for the specified tenant.
   */
  async getTenantSettings(@Param('tenant') tenant: string): Promise<ISettingsResponse> {
    this.logger.info('Get settings by tenant "%s"', tenant)

    const settings = await this.settingsServiceClient.getTenantSettings(tenant)

    return settings
  }
}
