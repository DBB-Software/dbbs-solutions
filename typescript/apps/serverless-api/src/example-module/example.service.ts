/**
 * Service representing an example service.
 * @module ExampleService
 */

import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { Injectable } from '@nestjs/common'
import { IExample } from '../types/example.js'

/**
 * Represents the example service.
 */
@Injectable()
export class ExampleService {
  /**
   * Constructs an instance of ExampleService.
   * @param {Logger} logger - The logger instance injected via dependency injection.
   */
  constructor(@InjectLogger(ExampleService.name) private readonly logger: Logger) {}

  /**
   * Retrieves an example by its ID.
   * @param {string} id - The ID of the example to retrieve.
   * @returns {IExample} The example object containing its ID and creation date.
   */
  getExample(id: string): IExample {
    this.logger.info('Get example by ID %s', id)

    return { id, date: new Date() }
  }
}
