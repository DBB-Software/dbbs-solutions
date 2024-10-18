import { beforeEach, expect, jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { PlanController } from '../../controllers/plan.controller.js'
import { PlanService } from '../../services/plan.service.js'
import {
  createOneTimePlanDto,
  createRecurringPlanDto,
  defaultOneTimePlan,
  defaultRecurringPlan
} from '../mocks/index.js'
import { NotFoundError } from '@dbbs/common'
import { BillingPeriod } from '../../enums/index.js'

describe('PlanController', () => {
  let controller: PlanController
  let planService: jest.Mocked<PlanService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [PlanController],
      providers: [

        {
          provide: PlanService,
          useValue: {
            getPlanById: jest.fn(),
            createPlan: jest.fn(),
            deletePlan: jest.fn()
          },
        },
      ],
    }).compile()

    controller = module.get<PlanController>(PlanController)
    planService = module.get(PlanService) as jest.Mocked<PlanService>
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getPlanById', () => {
    it.each([
      {
        name: 'should return the plan by ID',
        controllerMethodArgs: 1,
        expectedResult: defaultRecurringPlan,
        expectedParams: 1,
        setupMocks: () => {
          planService.getPlanById.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should throw NotFound if plan does not exist',
        controllerMethodArgs: 999,
        expectedError: new NotFoundError('Plan with ID 999 was not found'),
        expectedParams: 999,
        setupMocks: () => {
          planService.getPlanById.mockResolvedValue(null)
        },
      },
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await controller.getPlanById(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(planService.getPlanById).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('createPlan', () => {
    it.each([
      {
        name: 'should create a recurring plan',
        controllerMethodArgs: createRecurringPlanDto,
        expectedResult: defaultRecurringPlan,
        expectedParams: createRecurringPlanDto,
        setupMocks: () => {
          planService.createPlan.mockResolvedValue(defaultRecurringPlan)
        }
      },
      {
        name: 'should create a one-time plan and ignore provided interval',
        controllerMethodArgs: { ...createOneTimePlanDto, interval: BillingPeriod.MONTH },
        expectedResult: defaultOneTimePlan,
        expectedParams: createOneTimePlanDto,
        setupMocks: () => {
          planService.createPlan.mockResolvedValue(defaultOneTimePlan)
        }
      },
      {
        name: 'should throw an error if failed to create plan',
        controllerMethodArgs: createRecurringPlanDto,
        expectedError: new Error('Something went wrong'),
        expectedParams: createRecurringPlanDto,
        setupMocks: () => {
          planService.createPlan.mockRejectedValue(new Error('Something went wrong'))
        }
      },
      {
        name: 'should throw NotFound if product is not found',
        controllerMethodArgs: { ...createRecurringPlanDto, productId: 999 },
        expectedError: new NotFoundError('Cannot create plan for non-existing product with ID 999'),
        expectedParams: { ...createRecurringPlanDto, productId: 999 },
        setupMocks: () => {
          planService.createPlan.mockRejectedValue(
            new NotFoundError('Cannot create plan for non-existing product with ID 999')
          )
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await controller.createPlan(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(planService.createPlan).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('deletePlan', () => {
    it.each([
      {
        name: 'should delete a plan by ID',
        controllerMethodArgs: 1,
        expectedResult: { id: 1 },
        expectedParams: { id: 1 },
        setupMocks: () => {
          planService.deletePlan.mockResolvedValue(true)
        },
      },
      {
        name: 'should throw an error if failed to delete a plan',
        controllerMethodArgs: 1,
        expectedError: new Error('Something went wrong'),
        expectedParams: { id: 1 },
        setupMocks: () => {
          planService.deletePlan.mockRejectedValue(new Error('Something went wrong'))
        },
      },
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await controller.deletePlan(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(planService.deletePlan).toHaveBeenCalledWith(expectedParams)
    })
  })
})
