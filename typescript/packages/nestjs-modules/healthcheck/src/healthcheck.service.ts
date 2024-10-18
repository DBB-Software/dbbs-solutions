import { Injectable } from '@nestjs/common'

/**
 * Service that handles operations related to health checks.
 * It provides functionality to access the application's version and its startup timestamp.
 */
@Injectable()
export class HealthcheckService {
  /**
   * The timestamp of when the service was instantiated.
   * This timestamp is set upon the service's initialization.
   * @type {string}
   */
  private readonly timestamp: string

  /**
   * Initializes a new instance of the HealthcheckService.
   */
  constructor() {
    this.timestamp = new Date().toISOString()
  }

  /**
   * Retrieves the application's version and the timestamp when the service was initialized.
   * If the version is not specified in the environment variables, it defaults to "1.0.0".
   * @returns A promise that resolves to an object containing both the version and the initialization timestamp.
   */
  async getVersion(): Promise<{ version: string; start: string }> {
    return {
      version: process.env.npm_package_version ?? '1.0.0',
      start: this.timestamp
    }
  }
}
