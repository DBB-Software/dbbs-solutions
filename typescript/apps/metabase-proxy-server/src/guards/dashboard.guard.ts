import { Injectable } from '@nestjs/common'
import { MetabaseGuard } from './metabase.guard.js'

@Injectable()
export class DashboardGuard extends MetabaseGuard {
  async checkAccess(): Promise<boolean> {
    // return this.appService.hasAccessToDashboard(dashboardId, organizationsNames)
    return true
  }
}
