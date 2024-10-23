/**
 * Settings service responsible for interacting with AWS Lambda and retrieving tenant settings.
 */

import { SettingServiceClient } from '@dbbs/common'

class SettingsService {
  private settingsServiceClient: SettingServiceClient

  /**
   * Constructs an instance of the SettingsService class.
   *
   * @constructor
   * This constructor initializes the AWS Lambda client and the SettingServiceClient with the configuration values
   * retrieved from the Strapi server settings. It validates that the required configuration values (region, endpoint,
   * serviceName) are provided, and throws an error if any are missing.
   *
   * @throws {Error} Throws an error if region, endpoint, or serviceName is not defined.
   */
  constructor() {
    const region: string = strapi.config.get('server.settings.region')
    const endpoint: string = strapi.config.get('server.settings.endpoint')
    const serviceName: string = strapi.config.get('server.settings.serviceName')

    if (!region) {
      throw new Error('region is not defined')
    }

    if (!endpoint) {
      throw new Error('endpoint is not defined')
    }

    if (!serviceName) {
      throw new Error('serviceName is not defined')
    }

    this.settingsServiceClient = new SettingServiceClient({
      region,
      endpoint,
      settingsFunctionName: serviceName
    })
  }

  /**
   * Retrieves settings for all tenants.
   * @async
   * @returns {Promise<Object>} A promise that resolves with settings data for all tenants.
   */
  async getAllSettings() {
    const settings = await this.settingsServiceClient.getAllTenantSettings()
    return { settings }
  }

  /**
   * Retrieves settings for a specific tenant.
   * @async
   * @param {string} tenantId - The ID of the tenant.
   * @returns {Promise<Object>} A promise that resolves with settings data for the specified tenant.
   */
  async getSettings(tenantId) {
    const settings = await this.settingsServiceClient.getTenantSettings(tenantId)
    return { settings }
  }
}

export default new SettingsService()
