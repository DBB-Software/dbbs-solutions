import { Injectable, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import * as Sentry from '@sentry/node'
import { Model } from 'mongoose'
import axios from 'axios'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { CacheManager } from '@dbbs/nestjs-module-cache-manager'
import { User } from './database/schemas/user.schema.js'
import { HttpMethod } from './enums/index.js'
import { Organization } from './database/schemas/organization.schema.js'
import { Collection, Dashboard } from './interfaces/index.js'

@Injectable()
export class AppService {
  private readonly metabaseUrl: string

  private readonly apiKey: string

  private readonly cacheTTL: number

  constructor(
    private configService: ConfigService,
    private readonly cacheManager: CacheManager,
    @InjectLogger(AppService.name) private readonly logger: Logger,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Organization') private organizationModel: Model<Organization>
  ) {
    this.metabaseUrl = this.configService.get<string>('METABASE_URL') || ''
    this.apiKey = this.configService.get<string>('METABASE_API_KEY') || ''
    this.cacheTTL = Number(this.configService.get('REDIS_TTL'))
  }

  // TODO: replace with Cache Manager
  async onModuleInit() {
    await this.cacheDashboardsAndCollections()
  }

  // eslint-disable-next-line
  private handleAndLogError(error: any, message: string) {
    this.logger.error(message, { error })

    Sentry.captureException(error)

    if (error.response) {
      const { status, data } = error.response
      throw new HttpException(data, status)
    } else {
      throw new HttpException(message, 500)
    }
  }

  private getHeaders() {
    return { 'x-api-key': this.apiKey || '' }
  }

  private async getFromRedis(key: string) {
    this.logger.info(`Fetching data from Redis for key: ${key}`)
    const value = await this.cacheManager.get<string>(key)

    return value ? JSON.parse(value) : null
  }

  private slugifyName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async cacheDashboardsAndCollections() {
    try {
      const dashboards = await this.getAllDashboardsFromMetabase()
      const collections = await this.getAllCollectionsFromMetabase()

      await this.cacheManager.set('dashboards', dashboards, this.cacheTTL)
      await this.cacheManager.set('collections', collections, this.cacheTTL)

      this.logger.info('Dashboards and collections cached successfully')
    } catch (error) {
      this.logger.error('Error caching dashboards and collections', { error })
      Sentry.captureException(error)
    }
  }

  async resetCache() {
    try {
      await this.cacheManager.delete('dashboards')
      await this.cacheManager.delete('collections')

      this.logger.info('Cache has been reset successfully')
      return { message: 'Cache reset successfully' }
    } catch (error) {
      return this.handleAndLogError(error, 'Failed to reset cache')
    }
  }

  async reloadCache() {
    await this.resetCache()
    await this.cacheDashboardsAndCollections()

    return { message: 'Cache reloaded successfully' }
  }

  async getAllDashboardsFromMetabase() {
    try {
      const response = await this.proxyRequest(HttpMethod.GET, '/dashboard')

      this.logger.info(`Fetched ${response.length} dashboards from Metabase`)

      return response
    } catch (error) {
      return this.handleAndLogError(error, 'Error fetching dashboards from Metabase')
    }
  }

  async getAllCollectionsFromMetabase() {
    try {
      const response = await this.proxyRequest(HttpMethod.GET, '/collection')

      this.logger.info(`Fetched ${response.length} collections from Metabase`)

      return response
    } catch (error) {
      return this.handleAndLogError(error, 'Error fetching collections from Metabase')
    }
  }

  async proxyRequest(method: string, url: string, data?: unknown) {
    try {
      this.logger.info(`Proxying request to Metabase: ${url} with method ${method}`)

      const response = await axios({
        method,
        url: `${this.metabaseUrl}${url}`,
        data,
        headers: this.getHeaders()
      })

      this.logger.info(`Received response from Metabase for ${url}`)
      return response.data
    } catch (error) {
      return this.handleAndLogError(error, `Error in Metabase request for URL: ${url}`)
    }
  }

  async getDashboardsByOrganizationName(organizationsNames: string[]) {
    const dashboards = (await this.getFromRedis('dashboards')) || (await this.getAllDashboardsFromMetabase())
    const collections = await this.getCollectionsByOrganizationsNames(organizationsNames)
    const collectionIds = collections.map((collection: Collection) => collection.id)

    return dashboards.filter((dashboard: Dashboard) => collectionIds.includes(dashboard.collection_id))
  }

  async getCollectionsByOrganizationsNames(organizationsNames: string[]) {
    const collections = (await this.getFromRedis('collections')) || (await this.getAllCollectionsFromMetabase())

    const parentCollections = collections.filter((collection: Collection) =>
      organizationsNames.includes(this.slugifyName(collection.name))
    )

    return collections.filter((collection: Collection) =>
      parentCollections.some(
        (parentCollection: Collection) =>
          (collection.location && collection.location.includes(`/${parentCollection.id}/`)) ||
          collection.name === parentCollection.name
      )
    )
  }

  async hasAccessToCollection(collectionId: string, organizationsNames: string[]): Promise<boolean> {
    let collections = await this.getFromRedis('collections')

    if (!collections || !collections.some((collection: Collection) => collection.id === Number(collectionId))) {
      collections = await this.getAllCollectionsFromMetabase()
      await this.cacheManager.set('collections', JSON.stringify(collections))
    }

    const collection = collections.find((cl: Collection) => cl.id === Number(collectionId))

    if (!collection) {
      this.logger.error(`Collection ${collectionId} not found, Synchronize data between Metabase and Database`)
      const errorMessage = `Collection ${collectionId} not found`
      const exception = new HttpException(errorMessage, 404)
      Sentry.setContext('Collection', {
        id: collectionId
      })
      this.handleAndLogError(exception, errorMessage)
    }

    const locationParts = collection.location.split('/').filter(Boolean)
    const parentCollectionId = locationParts.length > 0 ? Number(locationParts[0]) : collection.id

    const parentCollection = collections.find((cl: Collection) => cl.id === parentCollectionId)
    const hasAccess = organizationsNames.includes(parentCollection?.name.toLowerCase())
    this.logger.info(
      `Access to collection ${collectionId} is ${hasAccess ? 'granted' : 'denied'}. Parent Collection ID: ${parentCollectionId || 'N/A'}, Parent Collection Name: ${parentCollection?.name || 'N/A'}`
    )
    return hasAccess
  }

  async hasAccessToDashboard(dashboardId: string, organizationsNames: string[]): Promise<boolean> {
    let dashboards = await this.getFromRedis('dashboards')

    if (!dashboards || !dashboards.some((dashboard: Dashboard) => dashboard.id === Number(dashboardId))) {
      dashboards = await this.getAllDashboardsFromMetabase()
      await this.cacheManager.set('dashboards', JSON.stringify(dashboards))
    }

    const collections = await this.getCollectionsByOrganizationsNames(organizationsNames)
    const collectionIds = collections.map((col: Collection) => col.id)
    const dashboard = dashboards.find((db: Dashboard) => db.id === Number(dashboardId))

    if (!dashboard) {
      this.logger.error(
        `Dashboard ${dashboardId} not found, Synchronize data between Metabase and Database. Parent Collection ID: ${dashboard.collection_id || 'N/A'},`
      )
      const errorMessage = `Dashboard ${dashboardId} not found`
      const exception = new HttpException(errorMessage, 404)

      Sentry.setContext('Dashboard', {
        id: dashboardId
      })
      this.handleAndLogError(exception, errorMessage)
    }

    const hasAccess = collectionIds.includes(dashboard.collection_id)

    this.logger.info(`Access to dashboard ${dashboardId} is ${hasAccess ? 'granted' : 'denied'}`)
    return hasAccess
  }

  async getOrganizationsNamesByUserEmail(email: string): Promise<string[]> {
    const user = await this.userModel.findOne({ email }).exec()

    if (!user || !user.organization || user.organization.length === 0) {
      const errorMessage = `No organizations found for user with email: ${email}`
      const exception = new HttpException(errorMessage, 404)
      Sentry.setContext('User', { id: user?.id })
      this.handleAndLogError(exception, errorMessage)
    }

    const organizations = await this.organizationModel
      .find({
        _id: { $in: user?.organization.map((organization) => organization.id) }
      })
      .exec()

    return organizations.map((organization) => this.slugifyName(organization.name))
  }
}
