import { InvokeCommand, InvokeCommandInput, InvokeCommandOutput, LambdaClient, LogType } from '@aws-sdk/client-lambda'
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node'
import { LRUCache } from 'typescript-lru-cache'
import { ISettingServiceClient } from './types/setting-service-client.js'

const entryExpirationTimeInMS = 3600000

export class SettingServiceClient implements ISettingServiceClient {
  lambdaClient: LambdaClient

  settingsFunctionName: string

  cache: LRUCache<string, object>

  constructor(client: LambdaClient, settingsFunctionName: string) {
    if (!settingsFunctionName) {
      throw new Error('settingsFunctionName is not defined')
    }

    if (!client) {
      throw new Error('lambdaClient is not defined')
    }

    this.settingsFunctionName = settingsFunctionName
    this.lambdaClient = client

    this.cache = new LRUCache<string, object>({
      entryExpirationTimeInMS
    })
  }

  async getAllTenantSettings() {
    return this.getSettings('all')
  }

  async getTenantSettings(tenantId: string) {
    return this.getSettings(tenantId)
  }

  async getSettings(tenantId: string): Promise<object> {
    // NOTE: .peek(key) Returns the value associated to the key, or null if there is none or if the entry is expired.
    // If an entry is returned, this will not mark the entry as most recently accessed.
    // Useful if a value is needed but the order of the cache should not be changed.
    const cachedSettings = this.cache.peek(tenantId)
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

    this.cache.set(tenantId, settingsObject)

    return settingsObject
  }
}
