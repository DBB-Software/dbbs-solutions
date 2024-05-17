import { Test, TestingModule } from '@nestjs/testing'
import { SettingsService } from './settings.service.js'
import { Logger, LoggerModule } from '@dbbs/nestjs-module-logger'
import { ClsService } from 'nestjs-cls'
import { jest } from '@jest/globals'
import { CLS_STORAGE_NAME } from '../constants.js'

describe('SettingsService', () => {
  let service: SettingsService
  let loggerMock: Logger
  let clsServiceMock: ClsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      providers: [
        SettingsService,
        {
          provide: Logger,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
            resolve: jest.fn()
          }
        }
      ]
    }).compile()

    service = await module.resolve<SettingsService>(SettingsService)
    loggerMock = await module.resolve<Logger>(Logger)
    clsServiceMock = await module.resolve<ClsService>(ClsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllTenantSettings', () => {
    it('should retrieve all settings for all tenants', async () => {
      const settingsResponse = { settings: {} } as never
      const getSettingsFuncMock = jest.fn().mockResolvedValue(settingsResponse)
      const storeMock = {
        context: { settingsService: { getAllTenantSettings: getSettingsFuncMock } }
      }
      jest.spyOn(clsServiceMock, 'get').mockReturnValue(storeMock)

      const result = await service.getAllTenantSettings()

      expect(result).toEqual(settingsResponse)
      expect(getSettingsFuncMock).toHaveBeenCalled()
      expect(clsServiceMock.get).toHaveBeenCalledWith(CLS_STORAGE_NAME)
    })
  })

  describe('getTenantSettings', () => {
    it('should retrieve settings for a specific tenant', async () => {
      const tenant = 'test'
      const settingsResponse = { settings: {} } as never
      const getSettingsFuncMock = jest.fn().mockResolvedValue(settingsResponse)
      const storeMock = {
        context: { settingsService: { getTenantSettings: getSettingsFuncMock } }
      }
      jest.spyOn(clsServiceMock, 'get').mockReturnValue(storeMock)

      const result = await service.getTenantSettings(tenant)

      expect(result).toEqual(settingsResponse)
      expect(getSettingsFuncMock).toHaveBeenCalledWith(tenant)
      expect(clsServiceMock.get).toHaveBeenCalledWith(CLS_STORAGE_NAME)
    })
  })
})
