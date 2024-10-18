import { Controller, Get, Param } from '@nestjs/common'
import { SettingsService } from './settings.service.js'
import { ISettingsResponse } from './interfaces.js'

@Controller('/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Retrieves settings for a specific tenant.
   * @param {string} tenant - The ID of the tenant.
   * @returns {Promise<ISettingsResponse>} The promise resolving to the settings object for the specified tenant.
   */
  @Get('')
  async getAllSettings(): Promise<ISettingsResponse> {
    const settings = await this.settingsService.getAllTenantSettings()

    return settings
  }

  /**
   * Retrieves all settings.
   * @returns {Promise<ISettingsResponse>} The promise resolving to the settings object.
   */
  @Get(':tenant')
  async getSettings(@Param('tenant') tenant: string): Promise<ISettingsResponse> {
    const settings = await this.settingsService.getTenantSettings(tenant)

    return settings
  }
}
