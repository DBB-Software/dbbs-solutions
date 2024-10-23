/**
 * Controller for managing example resources.
 * @module ExampleController
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IExampleResponse } from '../types/example.js'
import { ExampleService } from './example.service.js'

@UseGuards(AuthGuard('jwt'))
@Controller('/examples')
export class ExampleController {
  /**
   * Creates an instance of ExampleController.
   * @param {ExampleService} exampleService - The example service instance.
   */
  constructor(private readonly exampleService: ExampleService) {}

  /**
   * Retrieves an example by its ID.
   * @param {string} id - The ID of the example to retrieve.
   * @returns {Promise<IExampleResponse>} The promise resolving to the example response object.
   */
  @Get('/:id')
  async get(@Param('id') id: string): Promise<IExampleResponse> {
    const example = this.exampleService.getExample(id)
    return { example }
  }
}
