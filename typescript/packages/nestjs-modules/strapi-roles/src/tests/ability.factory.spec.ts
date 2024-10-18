import { Test, TestingModule } from '@nestjs/testing'
import { AbilityFactory } from '../ability.factory.js'
import { StrapiRolesService } from '../strapi-roles.service.js'
import { conditions, permissions } from '../mocks/default.mock.js'

describe('AbilityFactory', () => {
  let abilityFactory: AbilityFactory
  let strapiRolesService: StrapiRolesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbilityFactory,
        {
          provide: StrapiRolesService,
          useValue: {
            getPermissions: jest.fn(),
            getPermissionsByUserId: jest.fn()
          }
        }
      ]
    }).compile()

    abilityFactory = module.get<AbilityFactory>(AbilityFactory)
    strapiRolesService = module.get<StrapiRolesService>(StrapiRolesService)
  })

  type MethodName = 'initializePermissions' | 'getAbilitiesForUser' | 'findEnabledPermission'

  interface TestCase {
    method: MethodName
    name: string
    setup: () => void
    args: unknown[]
    expected: (result: unknown) => void
  }

  const successTestCases: TestCase[] = [
    {
      method: 'initializePermissions',
      name: 'should initialize permissions and abilities',
      setup: () => jest.spyOn(strapiRolesService, 'getPermissions').mockResolvedValue(['plugin::test.test.test']),
      args: [],
      expected: () => expect(abilityFactory['permissionsAbilities']).toBeDefined()
    },
    {
      method: 'getAbilitiesForUser',
      name: 'should return abilities for a user if permissions are enabled',
      setup: () => {
        jest.spyOn(strapiRolesService, 'getPermissions').mockResolvedValue(['plugin::test.test.test'])
        jest.spyOn(strapiRolesService, 'getPermissionsByUserId').mockResolvedValue(permissions)
      },
      args: ['123', 'plugin::test.test.test'],
      expected: (abilities) => expect(abilities).toBeDefined()
    },
    {
      method: 'getAbilitiesForUser',
      name: 'should create abilities for a subject with conditions',
      setup: () => {
        jest.spyOn(strapiRolesService, 'getPermissions').mockResolvedValue(['plugin::test.test.test'])
        jest.spyOn(strapiRolesService, 'getPermissionsByUserId').mockResolvedValue(permissions)
      },
      args: ['123', 'plugin::test.test.test', conditions],
      expected: (abilities) => expect(abilities).toBeDefined()
    },
    {
      method: 'findEnabledPermission',
      name: 'should return true if the permission is enabled for the subject',
      setup: () => {},
      args: [[{ action: 'plugin::test.test.test', id: 1, createdAt: '1', updatedAt: '1' }], 'plugin::test.test.test'],
      expected: (result) => expect(result).toBe(true)
    }
  ]

  const errorTestCases: TestCase[] = [
    {
      method: 'getAbilitiesForUser',
      name: 'should return false if permissions are not enabled for the subject',
      setup: () => jest.spyOn(strapiRolesService, 'getPermissionsByUserId').mockResolvedValue(permissions),
      args: ['123', 'plugin::test.invalid'],
      expected: (abilities) => expect(abilities).toBeFalsy()
    },
    {
      method: 'findEnabledPermission',
      name: 'should return false if the permission is not enabled for the subject',
      setup: () => {},
      args: [[{ action: 'plugin::test.test.test', id: 1, createdAt: '1', updatedAt: '1' }], 'plugin::test.invalid'],
      expected: (result) => expect(result).toBe(false)
    }
  ]

  successTestCases.forEach(({ method, name, setup, args, expected }) => {
    it(`${method} - ${name}`, async () => {
      setup()
      const result = await (abilityFactory[method] as (...args: any[]) => Promise<unknown>)(...args)
      expected(result)
    })
  })

  errorTestCases.forEach(({ method, name, setup, args, expected }) => {
    it(`${method} - ${name}`, async () => {
      setup()
      const result = await (abilityFactory[method] as (...args: any[]) => Promise<unknown>)(...args)
      expected(result)
    })
  })
})
