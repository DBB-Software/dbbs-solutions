import { Test, TestingModule } from '@nestjs/testing'
import { SettingsController } from './settings.controller.js'
import { SettingsService } from './settings.service.js'
import { jest } from '@jest/globals'

describe('SettingsController', () => {
  let controller: SettingsController
  let settingsServiceMock: SettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            getAllTenantSettings: jest.fn(),
            getTenantSettings: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<SettingsController>(SettingsController)
    settingsServiceMock = module.get<SettingsService>(SettingsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllSettings', () => {
    it('should return all settings', async () => {
      const settingsResponse = { settings: {} } as never

      jest.spyOn(settingsServiceMock, 'getAllTenantSettings').mockReturnValue(settingsResponse)

      const result = await controller.getAllSettings()

      expect(result).toEqual(settingsResponse)
      expect(settingsServiceMock.getAllTenantSettings).toHaveBeenCalled()
    })
  })

  describe('getSettings', () => {
    it('should return settings for a specific tenant', async () => {
      const tenantId = 'test'
      const settingsResponse = { settings: {} } as never

      jest.spyOn(settingsServiceMock, 'getTenantSettings').mockReturnValue(settingsResponse)

      const result = await controller.getSettings(tenantId)

      expect(result).toEqual(settingsResponse)
      expect(settingsServiceMock.getTenantSettings).toHaveBeenCalledWith(tenantId)
    })
  })
})
