import { Event } from '../../types/common.js'
import { User } from '../../types/user.js'

/**
 * Event representing the creation of a user.
 *
 * @class UserCreated
 * @implements {Event}
 */
export class UserCreated implements Event {
  private id: string

  private name: string

  /**
   * Creates an instance of UserCreated.
   *
   * @param {User} payload - The user data.
   *
   * This constructor initializes the event with the user data.
   */
  constructor(payload: User) {
    this.id = payload.id
    this.name = payload.name
  }

  /**
   * Converts the event to a JSON representation.
   *
   * @returns {{ id: string, name: string }} The event data in JSON format.
   *
   * This method serializes the event into a JSON object.
   */
  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
