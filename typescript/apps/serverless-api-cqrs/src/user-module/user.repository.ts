import { Injectable } from '@nestjs/common'
import { Event } from '../types/common.js'
import { UserAggregate } from './user.aggregate.js'
import { User } from '../types/user.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'

/**
 * Repository for managing user aggregates.
 *
 * @class UserRepository
 */
@Injectable()
export class UserRepository {
  private cache: { [key: string]: UserAggregate } = {}

  // @ts-ignore
  constructor(private readonly eventStore: EventStoreRepository) {}

  /**
   * Builds a user aggregate by ID.
   *
   * @param {string} [id] - The user ID (optional).
   * @returns {Promise<UserAggregate>} Promise resolving to the user aggregate.
   */
  async buildUserAggregate(id?: string): Promise<UserAggregate> {
    if (!id) {
      return new UserAggregate()
    }

    if (this.cache[id]) {
      return this.cache[id]
    }

    const events = await this.eventStore.getEventsByAggregateId(id)
    const aggregate: UserAggregate = events.reduce((agg: UserAggregate, event) => {
      if (event.eventName === 'UserCreated') {
        agg.create({ ...event.eventBody, id } as User)
      }
      return agg
    }, new UserAggregate())

    this.cache[id] = aggregate

    return aggregate
  }

  /**
   * Saves the user aggregate and events to the event store.
   *
   * @param {UserAggregate} aggregate - The user aggregate.
   * @param {Event[]} events - The events to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(aggregate: UserAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    await this.eventStore.saveEvents(aggregateId, events)

    this.cache.aggregateId = aggregate

    return true
  }
}
