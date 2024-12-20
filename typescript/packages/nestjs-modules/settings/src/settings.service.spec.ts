import { Test, TestingModule } from '@nestjs/testing'
import { SettingsService } from './settings.service.js'
import { Logger } from '@dbbs/nestjs-module-logger'
import { ISettingsServiceOptions, ISettingsResponse } from './interfaces.js'
import { SettingServiceClient } from '@dbbs/common'
import { jest } from '@jest/globals'

jest.mock('@dbbs/common', () => {
  return {
    SettingServiceClient: jest.fn().mockImplementation(() => ({
      getAllTenantSettings: jest.fn(),
      getTenantSettings: jest.fn()
    }))
  }
})

describe('SettingsService', () => {
  let service: SettingsService
  let logger: Logger
  let settingsServiceClient: SettingServiceClient

  const mockSettingsServiceOptions: ISettingsServiceOptions = {
    region: 'us-east-1',
    endpoint: 'http://localhost:3000',
    serviceName: 'TestService',
    enableXRay: false
  }

  const mockSettingsResponse: ISettingsResponse = {
    tenants: [
      {
        id: 'tenant1',
        settings: { key: 'value' }
      }
    ]
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: 'SETTINGS_SERVICE_OPTIONS',
          useValue: mockSettingsServiceOptions
        },
        {
          provide: 'NestLogger:SettingsService',
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<SettingsService>(SettingsService)
    logger = module.get<Logger>('NestLogger:SettingsService')
    settingsServiceClient = service.settingsServiceClient

    jest.spyOn(settingsServiceClient, 'getAllTenantSettings').mockResolvedValue(mockSettingsResponse)
    jest.spyOn(settingsServiceClient, 'getTenantSettings').mockResolvedValue(mockSettingsResponse)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllTenantSettings', () => {
    it('should call getAllTenantSettings and return settings', async () => {
      const settings = await service.getAllTenantSettings()

      expect(logger.info).toHaveBeenCalledWith('Get all settings')
      expect(settingsServiceClient.getAllTenantSettings).toHaveBeenCalled()
      expect(settings).toEqual(mockSettingsResponse)
    })
  })

  describe('getTenantSettings', () => {
    it('should call getTenantSettings and return settings for a specific tenant', async () => {
      const tenant = 'tenant1'
      const settings = await service.getTenantSettings(tenant)

      expect(logger.info).toHaveBeenCalledWith('Get settings by tenant "%s"', tenant)
      expect(settingsServiceClient.getTenantSettings).toHaveBeenCalledWith(tenant)
      expect(settings).toEqual(mockSettingsResponse)
    })
  })
})
