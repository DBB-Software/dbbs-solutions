import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LRUCache } from 'typescript-lru-cache'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { transformPermissions } from './helpers/permission-transformer.js'
import { SinglePermission } from './interfaces/index.js'

const entryExpirationTimeInMS = 60 * 60 * 1000

/**
 * Service for managing Strapi roles and permissions.
 * Fetches permissions from Strapi and caches them using an LRU cache.
 * @class StrapiRolesService
 */
@Injectable()
export class StrapiRolesService {
  private readonly strapiBaseUrl: string

  private readonly strapiAuthToken: string

  cache: LRUCache<string, object>

  /**
   * Constructs a new instance of the StrapiRolesService.
   * @constructor
   * @param {ConfigService} configService - Service for accessing configuration variables.
   * @param {HttpService} httpService - HTTP client service for making requests to Strapi.
   */
  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    this.strapiBaseUrl = this.configService.get<string>('STRAPI_BASE_URL') || 'http://127.0.0.1:1337'
    this.strapiAuthToken = this.configService.get<string>('STRAPI_AUTH_TOKEN') || ''

    this.cache = new LRUCache<string, object>({
      entryExpirationTimeInMS
    })
  }

  /**
   * Fetches and sets permissions from Strapi and caches them.
   * @private
   * @async
   * @returns {Promise<string[]>} - The transformed permissions.
   */
  private async setPermissions(): Promise<string[]> {
    const customPermissions = await firstValueFrom(
      this.httpService.get(`${this.strapiBaseUrl}/permissions-manager/get-permissions`, {
        headers: {
          Authorization: `Bearer ${this.strapiAuthToken}`
        }
      })
    )

    const defaultPermissions = await firstValueFrom(
      this.httpService.get(`${this.strapiBaseUrl}/api/users-permissions/permissions`, {
        headers: {
          Authorization: `Bearer ${this.strapiAuthToken}`
        }
      })
    )

    const transformedDefaultPermissions: string[] = transformPermissions(defaultPermissions.data.permissions)
    const transformedCustomPermissions: string[] = customPermissions.data.map(
      (permission: SinglePermission) => permission.action
    )

    const result: string[] = Array.from(new Set([...transformedDefaultPermissions, ...transformedCustomPermissions]))

    return result
  }

  /**
   * Retrieves permissions from the cache or fetches them if not cached.
   * @async
   * @returns {Promise<string[]>} - The list of permissions.
   * @throws {HttpException} - If unable to fetch permissions from Strapi.
   */
  async getPermissions(): Promise<string[]> {
    try {
      const cachedPermissions = this.cache.peek('permissions')
      if (cachedPermissions) {
        return cachedPermissions as string[]
      }

      return await this.setPermissions()
    } catch (error) {
      throw new HttpException('Failed to fetch permissions from Strapi', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves permissions for a specific user by user ID.
   * @async
   * @param {string} userId - The ID of the user.
   * @returns {Promise<string[]>} - The list of user-specific permissions.
   * @throws {HttpException} - If unable to fetch user permissions from Strapi.
   */
  async getPermissionsByUserId(userId: string) {
    try {
      const cachedPermissions = this.cache.peek('permissions')
      if (!cachedPermissions) {
        await this.setPermissions()
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.strapiBaseUrl}/api/users/${userId}?populate=role,role.permissions`, {
          headers: {
            Authorization: `Bearer ${this.strapiAuthToken}`
          }
        })
      )

      return response.data?.role?.permissions
    } catch (error) {
      throw new HttpException('Failed to fetch user permissions from Strapi', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
