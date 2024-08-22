import { InvokeCommand, InvokeCommandInput, InvokeCommandOutput, LambdaClient, LogType } from '@aws-sdk/client-lambda'
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node'
import { LRUCache } from 'typescript-lru-cache'
import AWSXRayCore from 'aws-xray-sdk-core'
import { ISettingServiceClient, ISettingServiceClientOptions } from './types/setting-service-client.js'

const entryExpirationTimeInMS = 3600000

/**
 * Implements the ISettingServiceClient interface to manage tenant settings through AWS Lambda functions.
 * Uses caching to optimize performance by reducing the number of Lambda invocations.
 */
export class SettingServiceClient implements ISettingServiceClient {
  lambdaClient: LambdaClient

  settingsFunctionName: string

  cache: LRUCache<string, object>

  /**
   * Initializes a new instance of the SettingServiceClient with necessary dependencies.
   * Configures the AWS Lambda client and optionally enables AWS X-Ray for tracing.
   * @param {ISettingServiceClientOptions} opts The configuration options for the SettingServiceClient.
   * @throws {Error} Throws an error if any required option is not provided.
   */
  constructor(opts: ISettingServiceClientOptions) {
    const { region, endpoint, settingsFunctionName, enableXRay = false } = opts

    if (!region) {
      throw new Error('region is not defined')
    }

    if (!endpoint) {
      throw new Error('endpoint is not defined')
    }

    if (!settingsFunctionName) {
      throw new Error('settingsFunctionName is not defined')
    }

    this.settingsFunctionName = settingsFunctionName

    this.lambdaClient = new LambdaClient({
      region,
      endpoint
    })

    this.lambdaClient = enableXRay ? AWSXRayCore.captureAWSv3Client(this.lambdaClient) : this.lambdaClient

    this.cache = new LRUCache<string, object>({
      entryExpirationTimeInMS
    })
  }

  /**
   * Retrieves all settings, leveraging caching to avoid unnecessary Lambda function invocations.
   * This method fetches global tenant settings by default.
   * @returns {Promise<object>} A promise that resolves to an object containing all tenant settings.
   */
  async getAllTenantSettings(): Promise<object> {
    return this.getSettings()
  }

  /**
   * Retrieves settings for a specific tenant, using a cache to improve performance.
   * If settings are not in the cache, it invokes a Lambda function to fetch them.
   * @param {string} tenantId The identifier of the tenant for whom settings are requested.
   * @returns {Promise<object>} A promise that resolves to an object containing the tenant's settings.
   */
  async getTenantSettings(tenantId: string): Promise<object> {
    return this.getSettings(tenantId)
  }

  /**
   * Generic method to fetch settings from Lambda, optionally filtered by tenant ID.
   * It first checks the cache; if missed, it calls the Lambda function and updates the cache.
   * @private
   * @param {string} [tenantId='all'] Optional tenant ID to fetch settings for a specific tenant; defaults to 'all' for global settings.
   * @returns {Promise<object>} A promise that resolves to the fetched settings.
   */
  async getSettings(tenantId?: string): Promise<object> {
    const tenantIdOrAll = tenantId ?? 'all'
    const cachedSettings = this.cache.peek(tenantIdOrAll)
    if (cachedSettings) {
      return cachedSettings
    }

    const invocationParams: InvokeCommandInput = {
      FunctionName: this.settingsFunctionName,
      LogType: LogType.Tail,
      Payload: fromUtf8(JSON.stringify({ tenantId }))
    }

    const invokeResult: InvokeCommandOutput = await this.lambdaClient.send(new InvokeCommand(invocationParams))

    const settingsObject = JSON.parse(toUtf8(invokeResult.Payload as Uint8Array))

    this.cache.set(tenantIdOrAll, settingsObject)

    return settingsObject
  }
}
