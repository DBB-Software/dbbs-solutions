import { HttpException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { getModelToken } from '@nestjs/mongoose'
import * as Sentry from '@sentry/node'
import { Redis } from 'ioredis'
import { AppService } from '../app.service.js'
import { mockCollections, mockRedis, mockDashboards, mockOrganizations, mockSentry } from '../mocks/index.js'
import { Logger } from '@dbbs/nestjs-module-logger'
import { jest } from '@jest/globals'
import { CacheManager } from '@dbbs/nestjs-module-cache-manager'
import { SENTRY_PROVIDER } from '@dbbs/nestjs-module-sentry'

jest.mock('axios')

describe('AppService', () => {
  let appService: AppService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        Logger,
        CacheManager,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: { [key: string]: string } = {
                METABASE_URL: 'http://metabase-url',
                METABASE_API_KEY: 'tests-api-key',
                REDIS_TTL: '3600'
              }

              return config[key]
            })
          }
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedis
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn()
          }
        },
        {
          provide: getModelToken('Organization'),
          useValue: {
            findById: jest.fn(),
            find: jest.fn()
          }
        },
        {
          provide: 'NestLogger:AppService',
          useClass: Logger
        },
        {
          provide: 'pino-params',
          useValue: {}
        },
        {
          provide: SENTRY_PROVIDER,
          useValue: mockSentry
        }
      ]
    }).compile()

    appService = module.get<AppService>(AppService)
    module.get<Redis>('default_IORedisModuleConnectionToken')
    module.get<ConfigService>(ConfigService)
    module.get(getModelToken('User'))
    module.get(getModelToken('Organization'))
    module.get(SENTRY_PROVIDER)
  })

  describe('onModuleInit', () => {
    it('should call cacheDashboardsAndCollections on init', async () => {
      const cacheDashboardsAndCollectionsSpy = jest.spyOn(appService, 'cacheDashboardsAndCollections')
      await appService.onModuleInit()
      expect(cacheDashboardsAndCollectionsSpy).toHaveBeenCalled()
    })
  })

  describe('hasAccessToCollection', () => {
    it('should fetch from Metabase if collections not found in Redis and return true', async () => {
      const mockCollectionsFromMetabase = [
        { id: 1, name: 'Test Org', location: '/1/' },
        { id: 2, name: 'Another Collection', location: '/1/2/' }
      ]

      jest.spyOn(appService, 'getAllCollectionsFromMetabase').mockResolvedValueOnce(mockCollectionsFromMetabase)
      jest.spyOn(mockRedis, 'set').mockReturnValueOnce(Promise.resolve('OK'))

      const result = await appService.hasAccessToCollection('2', ['test org'])
      expect(appService.getAllCollectionsFromMetabase).toHaveBeenCalled()
      expect(mockRedis.set).toHaveBeenCalledWith(
        'collections',
        expect.stringMatching(JSON.stringify(mockCollectionsFromMetabase))
      )
      expect(result).toBe(true)
    })
  })

  describe('hasAccessToDashboard', () => {
    it('should fetch dashboards from Metabase if not found in Redis and return true', async () => {
      jest.spyOn(appService, 'getAllDashboardsFromMetabase').mockResolvedValueOnce(mockDashboards)
      jest.spyOn(appService, 'getCollectionsByOrganizationsNames').mockResolvedValueOnce(mockCollections)
      jest.spyOn(mockRedis, 'set').mockReturnValueOnce(Promise.resolve('OK'))

      const result = await appService.hasAccessToDashboard('1', ['Test Org'])
      expect(appService.getAllDashboardsFromMetabase).toHaveBeenCalled()
      expect(mockRedis.set).toHaveBeenCalledWith('dashboards', expect.stringMatching(JSON.stringify(mockDashboards)))
      expect(result).toBe(true)
    })

    it('should return false if the organization does not have access to the dashboard', async () => {
      jest.spyOn(appService, 'getAllDashboardsFromMetabase').mockResolvedValueOnce(mockDashboards)
      jest
        .spyOn(appService, 'getCollectionsByOrganizationsNames')
        .mockResolvedValueOnce([{ id: '2', name: 'Another Org', location: '/2/' }])

      const result = await appService.hasAccessToDashboard('1', ['Another Org'])

      expect(result).toBe(false)
    })
  })

  describe('getCollectionsByOrganizationName', () => {
    it('should return filtered collections by organization name', async () => {
      jest.spyOn(appService, 'getAllCollectionsFromMetabase').mockResolvedValueOnce(mockCollections)

      const result = await appService.getCollectionsByOrganizationsNames(['testorg'])

      expect(result).toEqual([
        { id: '1', name: 'Test Org', location: '/1/' },
        { id: '3', name: 'Test Collection', location: '/1/3/' }
      ])
    })

    it('should fetch collections from Metabase if not found in Redis', async () => {
      const mockCollectionsFromMetabase = [
        { id: '1', name: 'Test Org', location: '/1/' },
        { id: '2', name: 'Another Org', location: '/2/' }
      ]

      jest.spyOn(appService, 'getAllCollectionsFromMetabase').mockResolvedValueOnce(mockCollectionsFromMetabase)

      const result = await appService.getCollectionsByOrganizationsNames(['testorg'])

      expect(appService.getAllCollectionsFromMetabase).toHaveBeenCalled()
      expect(result).toEqual([{ id: '1', name: 'Test Org', location: '/1/' }])
    })

    it('should return collections from Redis if they exist', async () => {
      const cachedCollections = JSON.stringify([
        { id: 1, name: 'Test Org', location: '/1/' },
        { id: 2, name: 'Another Org', location: '/2/' }
      ])

      jest.spyOn(mockRedis, 'get').mockReturnValueOnce(Promise.resolve(JSON.stringify(cachedCollections)))

      const result = await appService.getCollectionsByOrganizationsNames(['testorg'])

      expect(mockRedis.get).toHaveBeenCalledWith('collections')
      expect(result).toEqual([{ id: 1, name: 'Test Org', location: '/1/' }])
    })
  })

  describe('cacheDashboardsAndCollections', () => {
    it('should store dashboards and collections in Redis with TTL', async () => {
      jest.spyOn(appService, 'getAllDashboardsFromMetabase').mockResolvedValueOnce(mockDashboards)
      jest.spyOn(appService, 'getAllCollectionsFromMetabase').mockResolvedValueOnce(mockCollections)
      jest.spyOn(mockRedis, 'set').mockReturnValueOnce(Promise.resolve('OK'))

      await appService.cacheDashboardsAndCollections()

      expect(mockRedis.set).toHaveBeenCalledWith('dashboards', JSON.stringify(mockDashboards), 'EX', 3600)
      expect(mockRedis.set).toHaveBeenCalledWith('collections', JSON.stringify(mockCollections), 'EX', 3600)
    })
  })
  describe('getOrganizationsNamesByUserEmail', () => {
    beforeEach(() => {
      jest.spyOn(mockSentry, 'setContext').mockImplementation(() => {})
    })
    it('should return organization names if user and organizations are found', async () => {
      const mockUser = {
        email: 'tests@example.com',
        organization: [{ id: '1' }, { id: '2' }]
      }
      jest
        .spyOn(appService, 'getOrganizationsNamesByUserEmail')
        .mockResolvedValue(mockOrganizations.map((org) => org.name.toLowerCase()))

      const result = await appService.getOrganizationsNamesByUserEmail(mockUser.email)

      expect(result).toEqual(['org1', 'org2'])
    })

    it('should throw a 404 error if no user is found', async () => {
      const email = 'notfound@example.com'

      jest
        .spyOn(appService, 'getOrganizationsNamesByUserEmail')
        .mockRejectedValue(new HttpException('No organizations found', 404))

      await expect(appService.getOrganizationsNamesByUserEmail(email)).rejects.toThrow(HttpException)
    })

    it('should throw a 404 error if user has no organizations', async () => {
      const email = 'tests@example.com'

      jest.spyOn(appService, 'getOrganizationsNamesByUserEmail').mockResolvedValue([])

      const result = await appService.getOrganizationsNamesByUserEmail(email)

      expect(result).toEqual([])
    })

    it('should call Sentry with user context when an error occurs', async () => {
      const mockUser = {
        id: 'user123',
        email: 'tests@example.com',
        organization: []
      }

      jest
        .spyOn(appService, 'getOrganizationsNamesByUserEmail')
        .mockRejectedValue(new HttpException('No organizations found', 404))

      await expect(appService.getOrganizationsNamesByUserEmail(mockUser.email)).rejects.toThrow(HttpException)
    })
  })
})
