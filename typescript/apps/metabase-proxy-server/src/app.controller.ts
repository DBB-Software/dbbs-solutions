import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AppService } from './app.service.js'
import { HttpMethod } from './enums/index.js'
import { DashboardGuard } from './guards/dashboard.guard.js'
import { CollectionGuard } from './guards/collection.guard.js'
import { AdminGuard } from './guards/admin.guard.js'
import { GetDashcardCardParams, GetParamValuesParams, IGetParams, AuthRequest } from './interfaces/index.js'

@Controller('metabase')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'), DashboardGuard)
  @Post('dashboard/:dashboardId/dashcard/:dashcardId/card/:cardId/query/json')
  async getDashcardCard(
    @Param() params: GetDashcardCardParams,
    @Body() body: GetDashcardCardParams,
    @Query('parameters') parameters: string
  ) {
    const { dashboardId, dashcardId, cardId } = params
    const queryParams = parameters ? `?parameters=${parameters}` : ''

    return this.appService.proxyRequest(
      HttpMethod.POST,
      `/dashboard/${dashboardId}/dashcard/${dashcardId}/card/${cardId}/query/json${queryParams}`,
      body
    )
  }

  @UseGuards(AuthGuard('jwt'), DashboardGuard)
  @Get('dashboard/:dashboardId/params/:id/search/:query')
  async getParams(@Param() params: IGetParams) {
    const { dashboardId, id, query } = params
    return this.appService.proxyRequest(HttpMethod.GET, `/dashboard/${dashboardId}/params/${id}/search/${query}`)
  }

  @UseGuards(AuthGuard('jwt'), DashboardGuard)
  @Get('dashboard/:dashboardId/params/:id/values')
  async getParamValues(@Param() params: GetParamValuesParams) {
    const { dashboardId, id } = params
    return this.appService.proxyRequest(HttpMethod.GET, `/dashboard/${dashboardId}/params/${id}/values`)
  }

  @UseGuards(AuthGuard('jwt'), DashboardGuard)
  @Get('dashboard/:id')
  async getDashboard(@Param('id') id: string) {
    return this.appService.proxyRequest(HttpMethod.GET, `/dashboard/${id}`)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard')
  async getDashboards(@Req() request: AuthRequest) {
    const organizationsNames = await this.appService.getOrganizationsNamesByUserEmail(request.user.email)

    return this.appService.getDashboardsByOrganizationName(organizationsNames)
  }

  @UseGuards(AuthGuard('jwt'), CollectionGuard)
  @Get('collection/:id/items')
  async getCollectionItems(@Param('id') id: string) {
    return this.appService.proxyRequest(HttpMethod.GET, `/collection/${id}/items`)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('collection')
  async getCollections(@Req() req: AuthRequest) {
    const organizationsNames = await this.appService.getOrganizationsNamesByUserEmail(req.user.email)

    return this.appService.getCollectionsByOrganizationsNames(organizationsNames)
  }

  @UseGuards(AdminGuard)
  @Get('cache/reset')
  async resetCache() {
    return this.appService.resetCache()
  }

  @UseGuards(AdminGuard)
  @Get('cache/reload')
  async reloadCache() {
    return this.appService.reloadCache()
  }
}
