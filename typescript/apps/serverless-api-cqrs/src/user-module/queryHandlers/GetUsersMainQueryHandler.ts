import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { GetUsersMain } from '../queries/index.js'

/**
 * Query handler for fetching all main users.
 *
 * @class GetUsersMainQueryHandler
 * @implements {IQueryHandler<GetUsersMain>}
 */
@QueryHandler(GetUsersMain)
export class GetUsersMainQueryHandler implements IQueryHandler<GetUsersMain> {
  constructor(private repository: UserMainRepository) {}

  /**
   * Executes the query to get all main users.
   *
   * @returns {Promise<UserMain[]>} Promise resolving to an array of main users.
   */
  async execute() {
    return this.repository.getAll()
  }
}
