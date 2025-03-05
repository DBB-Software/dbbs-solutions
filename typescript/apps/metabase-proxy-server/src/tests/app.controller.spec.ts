import { Test, TestingModule } from '@nestjs/testing'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AppController } from '../app.controller.js'
import { AppService } from '../app.service.js'
import { DashboardGuard } from '../guards/dashboard.guard.js'
import { CollectionGuard } from '../guards/collection.guard.js'
import { createMockParams, createMockRequest } from '../mocks/index.js'
import { AuthRequest, GetDashcardCardParams, IGetParams } from '../interfaces/index.js'
import { jest } from '@jest/globals'
import { Reflector } from '@nestjs/core'

describe('AppController', () => {
  let appController: AppController
  let appService: AppService

  const mockAppService = {
    proxyRequest: jest.fn(),
    getOrganizationsNamesByUserEmail: jest.fn(),
    getDashboardsByOrganizationName: jest.fn(),
    getCollectionsByOrganizationsNames: jest.fn()
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        Reflector,
        {
          provide: AppService,
          useValue: mockAppService
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({})
      .overrideGuard(DashboardGuard)
      .useValue({})
      .overrideGuard(CollectionGuard)
      .useValue({})
      .compile()

    appController = app.get<AppController>(AppController)
    appService = app.get<AppService>(AppService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getDashboards', () => {
    it('should call getOrganizationsNamesByUserEmail and getDashboardsByOrganizationName with correct organization name', async () => {
      const mockRequest = createMockRequest()
      const mockOrganizationNames = ['Test Organization']

      mockAppService.getOrganizationsNamesByUserEmail.mockReturnValue(Promise.resolve(mockOrganizationNames))

      await appController.getDashboards(mockRequest)

      expect(appService.getOrganizationsNamesByUserEmail).toHaveBeenCalledWith('tests@example.com')
      expect(appService.getDashboardsByOrganizationName).toHaveBeenCalledWith(mockOrganizationNames)
    })
  })

  describe('getCollectionItems', () => {
    it('should call proxyRequest with correct parameters', async () => {
      const params = createMockParams({ id: '1' })

      await appController.getCollectionItems(<string>params.id)

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/collection/1/items')
    })
  })

  describe('getDashcardCard', () => {
    const params = createMockParams({
      dashboardId: '1',
      dashcardId: '2',
      cardId: '3'
    }) as unknown as GetDashcardCardParams
    const body = { dashboardId: '1', dashcardId: '2', cardId: '3' }

    it('should call proxyRequest with correct parameters', async () => {
      const query = '[value=tests]'

      await appController.getDashcardCard(params, body, query)

      expect(appService.proxyRequest).toHaveBeenCalledWith(
        'post',
        `/dashboard/1/dashcard/2/card/3/query/json?parameters=${query}`,
        body
      )
    })

    it('should throw an error if the service throws an error', async () => {
      const query = '[value=tests]'

      mockAppService.proxyRequest.mockReturnValueOnce(Promise.reject(new Error('Service Error')))

      await expect(appController.getDashcardCard(params, body, query)).rejects.toThrow('Service Error')

      expect(appService.proxyRequest).toHaveBeenCalledWith(
        'post',
        `/dashboard/1/dashcard/2/card/3/query/json?parameters=${query}`,
        body
      )
    })

    it('should call proxyRequest without query parameters if they are missing', async () => {
      await appController.getDashcardCard(params, body, '')

      expect(appService.proxyRequest).toHaveBeenCalledWith('post', `/dashboard/1/dashcard/2/card/3/query/json`, body)
    })
  })

  describe('getParams', () => {
    const params = createMockParams({
      dashboardId: '1',
      id: '123',
      query: 'tests-query'
    }) as unknown as IGetParams

    it('should call proxyRequest with correct parameters', async () => {
      await appController.getParams(params)

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/dashboard/1/params/123/search/tests-query')
    })

    it('should call proxyRequest without a query if none is provided', async () => {
      const params = createMockParams({
        dashboardId: '1',
        id: '123',
        query: ''
      }) as unknown as IGetParams
      await appController.getParams(params)

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/dashboard/1/params/123/search/')
    })
  })

  describe('getParamValues', () => {
    it('should call proxyRequest with correct parameters', async () => {
      const params = createMockParams({ dashboardId: '1', id: '123' }) as { dashboardId: string; id: string }

      await appController.getParamValues(params)

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/dashboard/1/params/123/values')
    })
  })

  describe('getDashboard', () => {
    const params = createMockParams({ id: '1' })

    it('should call proxyRequest with correct parameters', async () => {
      await appController.getDashboard(<string>params.id)

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/dashboard/1')
    })

    it('should throw an error if the service throws an error', async () => {
      mockAppService.proxyRequest.mockReturnValueOnce(Promise.reject(new Error('Service Error')))

      await expect(appController.getDashboard(<string>params.id)).rejects.toThrow('Service Error')

      expect(appService.proxyRequest).toHaveBeenCalledWith('get', '/dashboard/1')
    })
  })
  describe('getCollections', () => {
    const mockRequest = createMockRequest()

    it('should call getOrganizationsNamesByUserEmail and getCollectionsByOrganizationsNames with correct organization name', async () => {
      const mockOrganizationNames = ['Test Organization']

      mockAppService.getOrganizationsNamesByUserEmail.mockReturnValue(Promise.resolve(mockOrganizationNames))

      await appController.getCollections(mockRequest)

      expect(appService.getOrganizationsNamesByUserEmail).toHaveBeenCalledWith('tests@example.com')
      expect(appService.getCollectionsByOrganizationsNames).toHaveBeenCalledWith(mockOrganizationNames)
    })

    it('should return an empty array if no collections are found', async () => {
      mockAppService.getOrganizationsNamesByUserEmail.mockReturnValue(Promise.resolve(['Test Organization']))
      mockAppService.getCollectionsByOrganizationsNames.mockReturnValue(Promise.resolve([]))

      const result = await appController.getCollections(mockRequest)

      expect(appService.getOrganizationsNamesByUserEmail).toHaveBeenCalledWith('tests@example.com')
      expect(appService.getCollectionsByOrganizationsNames).toHaveBeenCalledWith(['Test Organization'])
      expect(result).toEqual([])
    })
  })
})
