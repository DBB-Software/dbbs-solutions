import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreatePlanDto } from '../../dtos/index.js'
import { BillingPeriod, Currency, PlanType } from '../../enums/index.js'

describe('CreatePlanDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data for a one-time plan',
      planInfo: {
        price: 100,
        productId: 1,
        type: PlanType.ONE_TIME,
        currency: Currency.USD
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should validate successfully with valid data for a recurring plan',
      planInfo: {
        price: 200,
        interval: BillingPeriod.MONTH,
        productId: 2,
        type: PlanType.RECURRING,
        currency: Currency.USD
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if price is not positive',
      planInfo: {
        price: 0,
        productId: 1,
        type: PlanType.ONE_TIME,
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'price must be a positive number'
    },
    {
      description: 'should fail validation if price is not a number',
      planInfo: {
        price: 'not-a-number',
        productId: 1,
        type: PlanType.ONE_TIME,
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'price must be a positive number'
    },
    {
      description: 'should fail validation if interval is not provided for a recurring plan',
      planInfo: {
        price: 150,
        productId: 1,
        type: PlanType.RECURRING,
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'You cannot create a recurring plan without specifying an interval'
    },
    {
      description: 'should fail validation if type is not a valid enum value',
      planInfo: {
        price: 150,
        productId: 1,
        type: 'INVALID_TYPE',
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'type must be one of the following values: one_time, recurring'
    },
    {
      description: 'should fail validation if interval is not a valid enum value',
      planInfo: {
        price: 200,
        interval: 'INVALID_INTERVAL',
        productId: 1,
        type: PlanType.RECURRING,
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'interval must be one of the following values: month, year'
    },
    {
      description: 'should fail validation if productId is not a number',
      planInfo: {
        price: 150,
        productId: 'not-a-number',
        type: PlanType.ONE_TIME,
        currency: Currency.USD
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'productId must be a number'
    },
    {
      description: 'should fail validation if currency is not a valid enum value',
      planInfo: {
        price: 150,
        productId: 1,
        type: PlanType.ONE_TIME,
        currency: 'INVALID_CURRENCY'
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'currency must be one of the following values: usd'
    }
  ])('$description', async ({ planInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const planDto = plainToInstance(CreatePlanDto, planInfo)
    const errors = await validate(planDto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})
