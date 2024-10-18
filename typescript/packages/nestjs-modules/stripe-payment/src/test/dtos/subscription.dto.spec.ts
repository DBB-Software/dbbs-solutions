import { UpdateSubscriptionQuantityDto } from '../../dtos/index.js'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

describe('UpdateSubscriptionQuantityDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      subscriptionInfo: { quantity: 5 },
      expectedErrorsLength: 0,
    },
    {
      description: 'should fail validation if quantity is less than 1',
      subscriptionInfo: { quantity: 0 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must not be less than 1',
    },
    {
      description: 'should fail validation if quantity is not an integer',
      subscriptionInfo: { quantity: 'five' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number',
    },
    {
      description: 'should fail validation if quantity is a float',
      subscriptionInfo: { quantity: 2.5 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number',
    },
    {
      description: 'should fail validation if quantity is missing',
      subscriptionInfo: {},
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be an integer number',
    },
  ])(
    '$description',
    async ({ subscriptionInfo, expectedErrorsLength, expectedErrorMessage }) => {
      const subscriptionDto = plainToInstance(UpdateSubscriptionQuantityDto, subscriptionInfo)
      const errors = await validate(subscriptionDto)

      expect(errors.length).toBe(expectedErrorsLength)
      if (expectedErrorsLength > 0 && expectedErrorMessage) {
        expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
      }
    }
  )
})
