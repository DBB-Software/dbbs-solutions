import { CreateCheckoutSessionDto, UpdateSubscriptionQuantityDto } from '../../dtos/index.js'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { SUCCESS_URL } from '../mocks/index.js'

describe('UpdateSubscriptionQuantityDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      subscriptionInfo: { quantity: 5 },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if quantity is less than 1',
      subscriptionInfo: { quantity: 0 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must not be less than 1'
    },
    {
      description: 'should fail validation if quantity is not an integer',
      subscriptionInfo: { quantity: 'five' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number'
    },
    {
      description: 'should fail validation if quantity is a float',
      subscriptionInfo: { quantity: 2.5 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number'
    },
    {
      description: 'should fail validation if quantity is missing',
      subscriptionInfo: {},
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number'
    }
  ])('$description', async ({ subscriptionInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const subscriptionDto = plainToInstance(UpdateSubscriptionQuantityDto, subscriptionInfo)
    const errors = await validate(subscriptionDto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe('CreateCheckoutSessionDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data (only organizationId is provided)',
      sessionInfo: {
        quantity: 2,
        planId: 1,
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if quantity is less than 1',
      sessionInfo: {
        quantity: 0,
        planId: 1,
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must not be less than 1'
    },
    {
      description: 'should fail validation if quantity is a string',
      sessionInfo: {
        quantity: 'two',
        planId: 1,
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number'
    },
    {
      description: 'should fail validation if quantity is a floating point number',
      sessionInfo: {
        quantity: 2.5,
        planId: 1,
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number'
    },
    {
      description: 'should fail validation if planId is a string',
      sessionInfo: {
        quantity: 2,
        planId: 'plan id',
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'planId must be an integer number'
    },
    {
      description: 'should fail validation if planId is a floating point number',
      sessionInfo: {
        quantity: 2,
        planId: 1.5,
        userId: 5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'planId must be an integer number'
    },
    {
      description: 'should fail validation if userId is a string',
      sessionInfo: {
        quantity: 2,
        planId: 1,
        userId: 'user id',
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'userId must be an integer number'
    },
    {
      description: 'should fail validation if userId is a floating point number',
      sessionInfo: {
        quantity: 2,
        planId: 1,
        userId: 5.5,
        successUrl: SUCCESS_URL,
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'userId must be an integer number'
    },
    {
      description: 'should fail validation if successUrl is not a valid URL',
      sessionInfo: {
        quantity: 2,
        planId: 1,
        userId: 5,
        successUrl: 'invalid-url',
        organizationId: 1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'successUrl must be a URL address'
    }
  ])('$description', async ({ sessionInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const checkoutSessionDto = plainToInstance(CreateCheckoutSessionDto, sessionInfo)
    const errors = await validate(checkoutSessionDto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})
