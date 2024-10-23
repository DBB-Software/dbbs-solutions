import { Controller, Get } from '@nestjs/common'
import { Public } from '@dbbs/nestjs-module-decorators'
import { HealthcheckService } from './healthcheck.service.js'

/**
 * Controller responsible for providing health check functionalities.
 * It offers endpoints to retrieve the application's version and the startup timestamp.
 */
@Public()
@Controller()
export class HealthcheckController {
  /**
   * Initializes a new instance of the HealthcheckController.
   * @param healthcheckService The service to handle health check operations.
   */
  constructor(private readonly healthcheckService: HealthcheckService) {}

  /**
   * Endpoint to get the current version and startup timestamp of the application.
   * @returns A promise that resolves to an object containing the version and startup timestamp.
   */
  @Get('/health-check')
  async getVersion(): Promise<{ version: string }> {
    return this.healthcheckService.getVersion()
  }
}
