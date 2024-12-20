import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'

import { OrganizationService } from '../services/organization.service.js'
import { OrganizationDto } from '../dtos/index.js'

@Controller('users')
export class UserController {
  constructor(
    @InjectLogger(UserController.name) private readonly logger: Logger,
    private readonly organizationService: OrganizationService
  ) {}

  @Get(':userId/organizations')
  async getUserOrganizations(@Param('userId', ParseIntPipe) userId: number): Promise<OrganizationDto[]> {
    try {
      return await this.organizationService.getUserOrganizations(userId)
    } catch (error) {
      this.logger.error((error as Error).message)

      throw error
    }
  }
}
