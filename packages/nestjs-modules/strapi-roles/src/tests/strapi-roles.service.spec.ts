import { Test, TestingModule } from '@nestjs/testing'
import { StrapiRolesService } from '../strapi-roles.service.js'
import { ConfigService } from '@nestjs/config'
import { HttpService, HttpModule } from '@nestjs/axios'
import { INestApplication } from '@nestjs/common'
import { customPermissions, defaultPermissions, userPermissions } from '../mocks/default.mock.js'
import { mockConfigService, mockHttpServiceGet } from '../mocks/factory.mock.js'

describe('StrapiRolesService', () => {
  let app: INestApplication
  let service: StrapiRolesService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StrapiRolesService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile()

    app = module.createNestApplication()
    await app.init()

    service = module.get<StrapiRolesService>(StrapiRolesService)
    httpService = module.get<HttpService>(HttpService)
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  type MethodName = 'getPermissions' | 'getPermissionsByUserId'

  const successTestCases = [
    {
      method: 'getPermissions' as MethodName,
      name: 'should return cached permissions if they exist',
      setup: () => service.cache.set('permissions', ['some-permission']),
      httpResponses: [],
      expected: ['some-permission']
    },
    {
      method: 'getPermissions' as MethodName,
      name: 'should fetch and cache permissions if not in cache',
      setup: () => {},
      httpResponses: [customPermissions, defaultPermissions],
      expected: ['some.test.action', 'plugin::test.test.test']
    },
    {
      method: 'getPermissionsByUserId' as MethodName,
      name: 'should return user permissions',
      setup: () => {},
      httpResponses: [customPermissions, defaultPermissions, userPermissions],
      expected: [{ action: 'plugin::test.test.test' }]
    }
  ]

  const errorTestCases = [
    {
      method: 'getPermissions' as MethodName,
      name: 'should throw an error if fetching permissions fails',
      setup: () => {},
      httpResponses: [new Error('Network Error')],
      expected: new Error('Failed to fetch permissions from Strapi')
    },
    {
      method: 'getPermissionsByUserId' as MethodName,
      name: 'should throw an error if fetching user permissions fails',
      setup: () => {},
      httpResponses: [{ permissions: {} }, new Error('Network Error')],
      expected: new Error('Failed to fetch user permissions from Strapi')
    }
  ]

  successTestCases.forEach(({ method, name, setup, httpResponses, expected }) => {
    it(`${method} - ${name}`, async () => {
      setup()
      mockHttpServiceGet(httpService, httpResponses)

      const result = await service[method]('123')
      expect(result).toEqual(expected)
    })
  })

  errorTestCases.forEach(({ method, name, setup, httpResponses, expected }) => {
    it(`${method} - ${name}`, async () => {
      setup()
      mockHttpServiceGet(httpService, httpResponses)

      await expect(service[method]('123')).rejects.toThrow(expected.message)
    })
  })
})
