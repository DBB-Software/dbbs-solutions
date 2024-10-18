import knex from 'knex'
import { PlanRepository } from '../../repositories/plan.repository.js'
import { createPlansTable, createProductsTable } from '../factories/database.js'
import {
  createdOneTimePlan,
  createdRecurringPlan,
  dbPlansList,
  dbProductsList,
  defaultPlanEntity,
  updatedAllFieldsEntity,
  updatedIntervalFieldsPlanEntity,
  updatedPriceFieldPlanEntity
} from '../mocks/index.js'
import { BillingPeriod, PlanType } from '../../enums/index.js'

describe('PlanRepository', () => {
  let planRepository: PlanRepository
  let db: knex.Knex

  const baseId = Date.now()
  const getId = (id: number) => id + baseId

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test_data.db'
      }
    })

    planRepository = new PlanRepository(db)

    await createProductsTable(db, dbProductsList(baseId))
    await createPlansTable(db, dbPlansList(baseId))
  })

  describe('Get plan by ID', () => {
    const testCases = [
      {
        description: 'should return plan by ID',
        id: getId(1),
        expected: defaultPlanEntity(baseId)
      },
      {
        description: 'should return null if plan does not exist',
        id: getId(999),
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ id, expected }) => {
      const result = await planRepository.getPlanById(id)

      expect(result).toEqual(expected)
    })
  })

  describe('Check if plan exists by Stripe ID', () => {
    const testCases = [
      {
        description: 'should return true if plan exists by Stripe ID',
        stripeId: `plan_${getId(1)}`,
        expected: true
      },
      {
        description: 'should return false if plan does not exist by Stripe ID',
        stripeId: 'non_existent_stripe_id',
        expected: false
      }
    ]

    it.each(testCases)('$description', async ({ stripeId, expected }) => {
      const result = await planRepository.planExistsByStripeId(stripeId)

      expect(result).toEqual(expected)
    })
  })

  describe('Get plan by Stripe ID', () => {
    const testCases = [
      {
        description: 'should return plan by Stripe ID',
        stripeId: `plan_${getId(1)}`,
        expected: defaultPlanEntity(baseId)
      },
      {
        description: 'should return null if plan does not exist by Stripe ID',
        stripeId: 'non_existent_stripe_id',
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ stripeId, expected }) => {
      const result = await planRepository.getPlanByStripeId(stripeId)

      expect(result).toEqual(expected)
    })
  })

  describe('Create plan', () => {
    const testCases = [
      {
        description: 'should create a new recurring plan and return it',
        serviceMethodArgs: {
          price: 1000,
          interval: BillingPeriod.MONTH,
          stripeId: `plan_${getId(4)}`,
          productId: getId(4),
          type: PlanType.RECURRING
        },
        expected: { ...createdRecurringPlan(baseId), id: expect.any(Number) }
      },
      {
        description: 'should create a new one-time plan and return it',
        serviceMethodArgs: {
          price: 1000,
          stripeId: `plan_${getId(4)}`,
          productId: getId(4),
          type: PlanType.ONE_TIME
        },
        expected: { ...createdOneTimePlan(baseId), id: expect.any(Number) }
      }
    ]

    it.each(testCases)('$description', async ({ serviceMethodArgs, expected }) => {
      const result = await planRepository.createPlan(serviceMethodArgs)

      expect(result).toEqual(expected)

      const planInDb = await db('plans').select('id').where({ id: result.id }).first()
      expect(planInDb.id).toEqual(result.id)
    })
  })

  describe('Update plan', () => {
    const testCases = [
      {
        description: 'should update one field and return the updated plan',
        id: getId(1),
        updatePayload: { id: getId(1), price: 1200, type: PlanType.RECURRING, interval: BillingPeriod.MONTH },
        expectedResult: updatedPriceFieldPlanEntity(baseId)
      },
      {
        description: 'should update multiple fields and return the updated plan',
        id: getId(1),
        updatePayload: {
          id: getId(1),
          price: 1200,
          interval: null,
          type: PlanType.ONE_TIME
        },
        expectedResult: updatedIntervalFieldsPlanEntity(baseId)
      },
      {
        description: 'should update all fields and return the updated plan',
        id: getId(1),
        updatePayload: {
          id: getId(1),
          price: 1500,
          interval: BillingPeriod.YEAR,
          type: PlanType.RECURRING
        },
        expectedResult: updatedAllFieldsEntity(baseId)
      },
      {
        description: 'should return null if plan does not exist',
        id: getId(999),
        updatePayload: { id: getId(999), price: 2000, interval: null, type: PlanType.ONE_TIME },
        expectedResult: null
      }
    ]

    it.each(testCases)('$description', async ({ id, updatePayload, expectedResult }) => {
      const result = await planRepository.updatePlan(updatePayload)
      expect(result).toEqual(expectedResult)

      if (expectedResult) {
        const planInDb = await db('plans').select('id').where({ id }).first()
        expect(planInDb.id).toEqual(result?.id)
      }
    })
  })
  describe('Delete plan', () => {
    const testCases = [
      {
        description: 'should delete the plan and return the number of deleted rows',
        id: getId(1),
        expected: 1
      },
      {
        description: 'should return 0 if plan does not exist',
        id: getId(999),
        expected: 0
      }
    ]

    it.each(testCases)('$description', async ({ id, expected }) => {
      const result = await planRepository.deletePlan(id)
      expect(result).toBe(expected)

      if (expected) {
        const planInDb = await db('plans').where({ id }).first()
        expect(planInDb).toBeUndefined()
      }
    })
  })
})
