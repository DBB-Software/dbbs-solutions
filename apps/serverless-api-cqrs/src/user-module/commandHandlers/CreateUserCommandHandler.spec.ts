import { jest } from '@jest/globals'
import { CreateUserCommandHandler } from './CreateUserCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { UserRepository } from '../user.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { CreateUserCommand } from '../commands/index.js'
import { UserWithOptionalId } from '../../types/user.js'
import { UserCreated } from '../events/index.js'

describe('CreateUserCommandHandler', () => {
  describe('execute', () => {
    const events = [new UserCreated({ id: '1', name: 'John Doe' })]

    let repository: UserRepository
    let aggregate: { create: (user: UserWithOptionalId) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: CreateUserCommandHandler

    beforeEach(() => {
      repository = new UserRepository({} as EventStoreRepository)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      aggregate = {
        create: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.create>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new CreateUserCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new CreateUserCommand({ name: 'John Doe' }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(aggregate.create).toHaveBeenCalledWith(payload)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
