import { Controller, HttpCode, Post, Get, Body, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { AcknowledgementResponse } from '../types/common.js'
import { CreateUserRequest, UserMain } from '../types/user.js'
import { CreateUserCommand } from './commands/index.js'
import { GetUsersMain, GetUserByIdMain } from './queries/index.js'

/**
 * Controller for managing user-related operations.
 *
 * @class UserController
 */
@Controller('/users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Endpoint for creating a new user.
   *
   * @param {CreateUserRequest} payload - The user creation request data.
   * @returns {Promise<AcknowledgementResponse>} Promise resolving to an acknowledgement response.
   */
  @Post('/create-user')
  @HttpCode(200)
  async createUser(@Body() payload: CreateUserRequest): Promise<AcknowledgementResponse> {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Name must be a non-empty string')
    }

    const command = new CreateUserCommand(payload)
    return this.commandBus.execute(command)
  }

  /**
   * Endpoint for retrieving all main users.
   *
   * @returns {Promise<UserMain[]>} Promise resolving to an array of main users.
   */
  @Get('/main')
  async getUsersMain(): Promise<UserMain[]> {
    return this.queryBus.execute(new GetUsersMain())
  }

  /**
   * Endpoint for retrieving a main user by ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<UserMain>} Promise resolving to the main user.
   */
  @Get('/main/:id')
  async getUserByIdMain(@Param('id') id: string): Promise<UserMain> {
    if (!id || id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }

    return this.queryBus.execute(new GetUserByIdMain(id))
  }
}
