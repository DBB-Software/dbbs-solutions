import { AggregateRoot } from '@nestjs/cqrs'
import { v4 } from 'uuid'
import { User, UserWithOptionalId } from '../types/user.js'
import { UserCreated } from './events/index.js'

/**
 * Aggregate root for managing user state and events.
 *
 * @class UserAggregate
 * @extends {AggregateRoot}
 */
export class UserAggregate extends AggregateRoot {
  private id: string

  private name: string

  /**
   * Creates a new user aggregate.
   *
   * @param {UserWithOptionalId} user - The user data.
   * @returns {UserCreated[]} Array of events applied.
   *
   * This method initializes a new user aggregate and applies the UserCreated event.
   */
  create(user: UserWithOptionalId) {
    this.id = user.id ?? v4()
    this.name = user.name

    const event = new UserCreated({
      id: this.id,
      name: this.name
    })
    this.apply(event)
    return [event]
  }

  /**
   * Converts the aggregate to a JSON representation.
   *
   * @returns {User} The user data in JSON format.
   * @throws {Error} If the aggregate is empty.
   *
   * This method serializes the user aggregate into a JSON object.
   */
  toJson(): User {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      name: this.name
    }
  }
}
