import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { CreateUserCommand } from '../commands/index.js'
import { UserRepository } from '../user.repository.js'

/**
 * Command handler for creating a new user.
 *
 * @class CreateUserCommandHandler
 * @implements {ICommandHandler<CreateUserCommand>}
 */
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private repository: UserRepository,
    private publisher: EventPublisher
  ) {}

  /**
   * Executes the command to create a new user.
   *
   * @param {CreateUserCommand} command - The user creation command.
   * @returns {Promise<string>} Promise resolving to an acknowledgement string.
   */
  async execute(command: CreateUserCommand): Promise<string> {
    const userAggregate = this.publisher.mergeObjectContext(await this.repository.buildUserAggregate())

    const events = userAggregate.create(command)
    await this.repository.save(userAggregate, events)

    userAggregate.commit()

    return 'Acknowledgement OK'
  }
}
