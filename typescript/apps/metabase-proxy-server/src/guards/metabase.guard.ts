import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
// import { AppService } from '../app.service.js'

@Injectable()
export abstract class MetabaseGuard {
  constructor(
    // protected appService: AppService,
    @InjectLogger(MetabaseGuard.name) private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userEmail = request.user.email
    const resourceId = request.params.dashboardId || request.params.id

    if (!userEmail) {
      this.logger.error('User email not found in token')
      throw new ForbiddenException('User email not found in token')
    }

    this.logger.info(`Checking access for user ${userEmail} to resource ${resourceId}`)

    return true

    // TODO: provide logic to check access by id or organization name
    // const organizationsNames = await this.appService.getOrganizationsNamesByUserEmail(userEmail)
    // const hasAccess = await this.checkAccess(organizationsNames, resourceId)
    //
    // if (!hasAccess) {
    //   this.logger.error(`Access denied for user ${userEmail}`)
    //
    //   const exception = new ForbiddenException('Access denied to this resource')
    //
    //   Sentry.captureException(exception)
    //   throw exception
    // }
    //
    // return true
  }

  abstract checkAccess(organization: string[], resourceId: string): Promise<boolean>
}
