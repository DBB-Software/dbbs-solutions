import { jest } from '@jest/globals'
import { UserController } from './user.controller.js'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './commands/index.js'
import { ModuleRef } from '@nestjs/core/injector/module-ref.js'
import { GetUsersMain, GetUserByIdMain } from './queries/index.js'

describe('UserController', () => {
  describe('createUser', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new UserController(commandBus, {} as QueryBus)

    const testCases = [
      {
        description: 'should create CreateUserCommand',
        payload: { name: 'John Doe' },
        expected: new CreateUserCommand({ name: 'John Doe' })
      },
      {
        description: 'should throw a validation error',
        payload: { name: '' },
        expectedError: 'Name must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.createUser(payload)
        expect(commandBus.execute).toHaveBeenCalledWith(expected)

        if (expectedError) {
          expect(true).toBeFalsy()
        }
      } catch (err) {
        if (!expectedError) {
          throw err
        }
        expect((err as Error).message).toEqual(expectedError)
      }
    })
  })

  describe('getUsersMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as jest.Mocked<typeof queryBus.execute>
    const controller = new UserController({} as CommandBus, queryBus)

    const testCases = [
      {
        description: 'should call query bus with GetUsersMain query',
        expected: new GetUsersMain()
      }
    ]
    test.each(testCases)('$description', async ({ expected }) => {
      await controller.getUsersMain()
      expect(queryBus.execute).toHaveBeenCalledWith(expected)
    })
  })

  describe('getUserByIdMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as jest.Mocked<typeof queryBus.execute>
    const controller = new UserController({} as CommandBus, queryBus)

    const testCases = [
      {
        description: 'should call query bus with GetUserByIdMain query',
        id: '1',
        expected: new GetUserByIdMain('1')
      },
      {
        description: 'should throw a validation error',
        id: '',
        expectedError: 'ID must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected, expectedError }) => {
      try {
        await controller.getUserByIdMain(id)
        expect(queryBus.execute).toHaveBeenCalledWith(expected)

        if (expectedError) {
          expect(true).toBeFalsy()
        }
      } catch (err) {
        if (!expectedError) {
          throw err
        }
        expect((err as Error).message).toEqual(expectedError)
      }
    })
  })
})
