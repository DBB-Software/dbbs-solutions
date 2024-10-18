import { CreateUserRequest } from '../../types/user.js'

/**
 * Command for creating a new user.
 *
 * @class CreateUserCommand
 * @param {CreateUserRequest} payload - The user creation data.
 */
export class CreateUserCommand {
  public readonly name: string

  constructor(public readonly payload: CreateUserRequest) {
    this.name = payload.name
  }
}
