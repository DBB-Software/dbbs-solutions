import { plainToInstance } from 'class-transformer'
import { PaginationOptionsDto } from '../../dtos/index.js'
import { validate } from 'class-validator'

describe('PaginationOptionsDto', () => {
  it.each([
    {
      description: 'should validate successfully with valid page and perPage',
      paginationInfo: { page: '2', perPage: '20' },
      expectedErrorsLength: 0,
    },
    {
      description: 'should validate successfully with only page',
      paginationInfo: { page: '5' },
      expectedErrorsLength: 0,
    },
    {
      description: 'should validate successfully with only perPage',
      paginationInfo: { perPage: '15' },
      expectedErrorsLength: 0,
    },
    {
      description: 'should validate successfully with no page or perPage',
      paginationInfo: {},
      expectedErrorsLength: 0,
    },
    {
      description: 'should fail validation if page is negative',
      paginationInfo: { page: '-5' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'page must be a positive number',
    },
    {
      description: 'should fail validation if perPage is negative',
      paginationInfo: { perPage: '-10' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'perPage must be a positive number',
    },
    {
      description: 'should fail validation if page is not a number',
      paginationInfo: { page: 'not a number' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'page must be a number',
    },
    {
      description: 'should fail validation if perPage is not a number',
      paginationInfo: { perPage: 'not a number' },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'perPage must be a number',
    },
  ])(
    '$description',
    async ({ paginationInfo, expectedErrorsLength, expectedErrorMessage }) => {
      const paginationDto = plainToInstance(PaginationOptionsDto, paginationInfo)
      const errors = await validate(paginationDto)

      expect(errors.length).toBe(expectedErrorsLength)
      if (expectedErrorsLength > 0 && expectedErrorMessage) {
        expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
      }
    },
  )
})