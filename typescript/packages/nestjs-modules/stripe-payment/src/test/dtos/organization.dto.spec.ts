import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import {
  AcceptInviteDto,
  CreateOrganizationDto,
  UpdateOrganizationNameDto,
  UpdateOrganizationOwnerDto,
  UpdateOrganizationQuantityDto
} from '../../dtos/index.js'

describe(`${CreateOrganizationDto.name}`, () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      organizationInfo: {
        name: 'Organization',
        ownerId: 123,
        email: 'owner31231@example.com',
        quantity: 5
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if quantity is not positive',
      organizationInfo: {
        name: 'Organization',
        ownerId: 123,
        email: 'owner3213@example.com',
        quantity: 0
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be a positive number'
    },
    {
      description: 'should fail validation if name is not a string',
      organizationInfo: {
        name: 123,
        ownerId: 123,
        email: 'owner123@example.com',
        quantity: 5
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be a string'
    },
    {
      description: 'should fail validation if email is not correct',
      organizationInfo: {
        name: 'Org',
        ownerId: 123,
        email: '2.com',
        quantity: 5
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'email must be an email'
    }
  ])('$description', async ({ organizationInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const dto = plainToInstance(CreateOrganizationDto, organizationInfo)
    const errors = await validate(dto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe(UpdateOrganizationQuantityDto.name, () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      updateInfo: {
        quantity: 10
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if quantity is negative',
      updateInfo: {
        quantity: -1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be a positive number'
    },
    {
      description: 'should fail validation if quantity is not a number',
      updateInfo: {
        quantity: {}
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'quantity must be a positive number'
    }
  ])('$description', async ({ updateInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const dto = plainToInstance(UpdateOrganizationQuantityDto, updateInfo)
    const errors = await validate(dto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe(UpdateOrganizationNameDto.name, () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      updateInfo: {
        name: 'Updated Organization'
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if name is not a string',
      updateInfo: {
        name: 3123
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be a string'
    },
    {
      description: 'should fail validation if name is absent',
      updateInfo: {},
      expectedErrorsLength: 1,
      expectedErrorMessage: 'name must be a string'
    }
  ])('$description', async ({ updateInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const dto = plainToInstance(UpdateOrganizationNameDto, updateInfo)
    const errors = await validate(dto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe(UpdateOrganizationOwnerDto.name, () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      updateInfo: {
        ownerId: 10
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if ownerId is negative',
      updateInfo: {
        ownerId: -1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'ownerId must be a positive number'
    },
    {
      description: 'should fail validation if ownerId is not a number',
      updateInfo: {
        ownerId: {}
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'ownerId must be a positive number'
    }
  ])('$description', async ({ updateInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const dto = plainToInstance(UpdateOrganizationOwnerDto, updateInfo)
    const errors = await validate(dto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})

describe(AcceptInviteDto.name, () => {
  it.each([
    {
      description: 'should validate successfully with valid data',
      updateInfo: {
        userId: 10
      },
      expectedErrorsLength: 0
    },
    {
      description: 'should fail validation if userId is negative',
      updateInfo: {
        userId: -1
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'userId must be a positive number'
    },
    {
      description: 'should fail validation if userId is not a number',
      updateInfo: {
        userId: {}
      },
      expectedErrorsLength: 1,
      expectedErrorMessage: 'userId must be a positive number'
    }
  ])('$description', async ({ updateInfo, expectedErrorsLength, expectedErrorMessage }) => {
    const dto = plainToInstance(AcceptInviteDto, updateInfo)
    const errors = await validate(dto)

    expect(errors.length).toBe(expectedErrorsLength)
    if (expectedErrorsLength > 0 && expectedErrorMessage) {
      expect(JSON.stringify(errors)).toContain(expectedErrorMessage)
    }
  })
})
