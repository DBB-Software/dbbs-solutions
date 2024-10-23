import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateProductDto, UpdateProductDto } from '../../dtos/index.js'

describe('CreateProductDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      productInfo: { name: 'valid name' },
      expectedErrorsLength: 0,
    },
    {
      description: 'should fail validation if name is too short',
      productInfo: { name: 'n' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be longer than or equal to 3 characters',
    },
    {
      description: 'should fail validation if name is too long',
      productInfo: { name: 'a'.repeat(51) },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be shorter than or equal to 50 characters',
    },
    {
      description: 'should fail validation if name is not a string',
      productInfo: { name: 123 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be a string',
    },
  ])('$description', async ({ productInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const productDto = plainToInstance(CreateProductDto, productInfo)
    const errors = await validate(productDto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe('UpdateProductDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      productInfo: { name: 'valid name' },
      expectedErrorsLength: 0,
    },
    {
      description: 'should fail validation if name is too short',
      productInfo: { name: 'n' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be longer than or equal to 3 characters',
    },
    {
      description: 'should fail validation if name is too long',
      productInfo: { name: 'a'.repeat(51) },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be shorter than or equal to 50 characters',
    },
    {
      description: 'should fail validation if name is not a string',
      productInfo: { name: 123 },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be a string',
    },
  ])('$description', async ({ productInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const productDto = plainToInstance(UpdateProductDto, productInfo)
    const errors = await validate(productDto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})
