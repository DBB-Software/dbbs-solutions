import { Injectable, Param } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { CLS_STORAGE_NAME } from '../constants.js'
import { ISettingsResponse } from '../types/settings.js'

/**
 * Service for handling tenant settings.
 */
@Injectable()
export class SettingsService {
  constructor(
    /**
     * Constructs an instance of ExampleService.
     * @param {Logger} logger - The logger instance injected via dependency injection.
     */
    @InjectLogger(SettingsService.name) private readonly logger: Logger,
    /**
     * Constructs an instance of the settings service.
     * @param {ClsService} cls Service for managing context.
     */
    private readonly cls: ClsService
  ) {}

  /**
   * Retrieves all settings for all tenants.
   * @returns {Promise<ISettingsResponse>} Object containing settings for all tenants.
   */
  async getAllTenantSettings(): Promise<ISettingsResponse> {
    const store = this.cls.get(CLS_STORAGE_NAME)

    this.logger.info('Get all settings')

    const settings = await store?.context?.settingsService.getAllTenantSettings()

    return settings
  }

  /**
   * Retrieves settings for a specific tenant.
   * @param {string} tenant Identifier of the tenant.
   * @returns {Promise<ISettingsResponse>} Object containing settings for the specified tenant.
   */
  async getTenantSettings(@Param('tenant') tenant: string): Promise<ISettingsResponse> {
    const store = this.cls.get(CLS_STORAGE_NAME)

    this.logger.info('Get settings by tenant "%s"', tenant)

    const settings = await store?.context?.settingsService.getTenantSettings(tenant)

    return settings
  }
}
