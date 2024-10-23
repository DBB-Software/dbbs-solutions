import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AbilityFactory } from '../ability.factory.js'
import { AbilityGuard } from '../ability.guard.js'
import { StrapiRolesService } from '../strapi-roles.service.js'
import { AbilityBuilder, PureAbility, AbilityClass, ForbiddenError, ConditionsMatcher } from '@casl/ability'
import { DEFAULT_ACTION } from '../constants/index.js'
import { AppAbility } from '../types/index.js'
import { customConditionsMatcher } from '../helpers/conditions-matcher.js'

describe('AbilityGuard', () => {
  let abilityGuard: AbilityGuard
  let abilityFactory: AbilityFactory
  let reflector: Reflector
  let context: ExecutionContext
  let mockQuery: object

  beforeEach(async () => {
    mockQuery = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbilityGuard,
        AbilityFactory,
        Reflector,
        {
          provide: StrapiRolesService,
          useValue: {
            getPermissions: jest.fn(),
            getPermissionsByUserId: jest.fn()
          }
        }
      ]
    }).compile()

    abilityGuard = module.get<AbilityGuard>(AbilityGuard)
    abilityFactory = module.get<AbilityFactory>(AbilityFactory)
    reflector = module.get<Reflector>(Reflector)
    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '123' },
          query: mockQuery
        })
      }),
      getHandler: jest.fn(),
      getClass: jest.fn()
    } as unknown as ExecutionContext
  })

  it('should be defined', () => {
    expect(abilityGuard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true if no requirement is found', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined)

      const result = await abilityGuard.canActivate(context)
      expect(result).toBe(true)
    })

    it('should return false if no user is found', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue({ subject: 'plugin::test.test.test' })

      context.switchToHttp = () =>
        ({
          getRequest: () => ({
            user: undefined
          })
        }) as any

      const result = await abilityGuard.canActivate(context)
      expect(result).toBe(false)
    })

    it('should return false if no abilities are found', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue({ subject: 'plugin::test.test.test' })
      jest.spyOn(abilityFactory, 'getAbilitiesForUser').mockResolvedValue(false)

      const result = await abilityGuard.canActivate(context)
      expect(result).toBe(false)
    })

    it('should throw an error if user does not have access', async () => {
      const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)
      can(DEFAULT_ACTION, 'plugin::test.test.test1')
      const ability = build({
        conditionsMatcher: customConditionsMatcher as ConditionsMatcher<unknown>
      })

      jest.spyOn(reflector, 'get').mockReturnValue({ subject: 'plugin::test.test.test' })
      jest.spyOn(abilityFactory, 'getAbilitiesForUser').mockResolvedValue(ability)

      jest.spyOn(ability, 'can').mockReturnValue(false)

      // @ts-ignore
      await expect(abilityGuard.canActivate(context)).rejects.toThrow(ForbiddenError)
    })

    it('should apply conditions and return true if user has access', async () => {
      const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)
      can(DEFAULT_ACTION, 'plugin::test.test.test')
      const ability = build({ conditionsMatcher: customConditionsMatcher as ConditionsMatcher<unknown> })

      jest.spyOn(reflector, 'get').mockReturnValue({
        subject: 'plugin::test.test.test',
        conditions: [{ field: 'user.id', operator: 'eq', value: 'user.id' }]
      })
      jest.spyOn(abilityFactory, 'getAbilitiesForUser').mockResolvedValue(ability)
      jest.spyOn(ability, 'can').mockReturnValue(true)

      const result = await abilityGuard.canActivate(context)
      expect(result).toBe(true)
      expect(context.switchToHttp().getRequest().query).toEqual({ 'user.id': { $eq: '123' } })
    })
  })
})
