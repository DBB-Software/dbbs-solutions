import {
  PutItemCommand,
  UpdateItemCommand,
  ScanCommand,
  ScanCommandInput,
  QueryCommand,
  QueryCommandInput,
  AttributeValue,
  UpdateItemCommandInput,
  DynamoDBClient
} from '@aws-sdk/client-dynamodb'
import { ItemsResult, PageType, QueryParams, ScanResult } from '../types/urls.js'

interface DynamoDBHelperConfig {
  region: string
  tableName: string
}

interface DynamoDBCreateItem {
  url: string
  tenant: string
  contentType: string
  keyword: string
  status?: string
  previousStatus?: string
  code?: string
  previousCode?: string
  attempts?: string
  headers?: {
    S: string
  }[]
}

interface DynamoDBUpdateItem {
  url: string
  status: string
  previousStatus: string
  code: string
  previousCode: string
  attempts: string
  headers: {
    S: string
  }[]
  urlKeyword: string
}

class DynamoDBHelper {
  private readonly client: DynamoDBClient

  private readonly tableName: string

  constructor(config: DynamoDBHelperConfig) {
    this.client = new DynamoDBClient({
      region: config.region,
      apiVersion: 'latest'
    })
    this.tableName = config.tableName
  }

  async createItem(item: DynamoDBCreateItem): Promise<void> {
    const { url, tenant, contentType, keyword, status, previousStatus, code, previousCode, attempts, headers } = item

    const Item: Record<string, AttributeValue> = {
      url: {
        S: url
      },
      createdAt: {
        S: new Date().toUTCString()
      },
      tenant: {
        S: tenant
      },
      contentType: {
        S: contentType ?? 'other'
      },
      keyword: {
        S: keyword ?? ''
      }
    }

    if (status) {
      Item.status = {
        S: status
      }
    }
    if (previousStatus) {
      Item.previousStatus = {
        S: previousStatus
      }
    }
    if (code) {
      Item.code = {
        S: code
      }
    }
    if (previousCode) {
      Item.previousCode = {
        S: previousCode
      }
    }
    if (attempts) {
      Item.attempts = {
        S: attempts
      }
    }
    if (headers) {
      Item.headers = {
        L: headers
      }
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item
    })

    await this.client.send(command)
  }

  async updateItem(item: DynamoDBUpdateItem): Promise<void> {
    const { url, status, code, headers, attempts, previousStatus, previousCode, urlKeyword } = item

    const updateInput: UpdateItemCommandInput = {
      ExpressionAttributeNames: {
        '#StatusVariable': 'statusName',
        '#CodeVariable': 'code',
        '#HeadersVariable': 'headers',
        '#AttemptsVariable': 'attempts',
        '#UpdatedVariable': 'updatedAt',
        '#PreviousStatusVariable': 'previousStatus',
        '#PreviousCodeVariable': 'previousCode',
        '#UrlKeyword': 'keyword'
      },
      ExpressionAttributeValues: {
        ':status': { S: status },
        ':code': { S: `${code}` },
        ':headers': { L: headers },
        ':attempts': { N: attempts },
        ':updatedAt': { S: new Date().toUTCString() },
        ':previousStatus': { S: previousStatus },
        ':previousCode': { S: previousCode },
        ':keyword': { S: urlKeyword }
      },
      Key: {
        url: {
          S: url
        }
      },
      TableName: this.tableName,
      UpdateExpression:
        'set #StatusVariable=:status, #CodeVariable=:code, #HeadersVariable=:headers, #AttemptsVariable=:attempts, #UpdatedVariable=:updatedAt, #PreviousStatusVariable=:previousStatus, #PreviousCodeVariable=:previousCode, #UrlKeyword=:keyword'
    }
    const command = new UpdateItemCommand(updateInput)

    await this.client.send(command)
  }

  async getAllItems({ lastEvaluatedKey, limit }: QueryParams): Promise<ScanResult> {
    const scanResults: Array<PageType> = []
    const scanParams: ScanCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey
    }

    const items = (await this.client.send(new ScanCommand(scanParams))) as ItemsResult
    items.Items?.forEach((item) =>
      scanResults.push({
        url: item.url?.S ?? '',
        status: item.statusName?.S ?? '',
        code: item.code?.S ?? '',
        keyword: item.keyword?.S ?? ''
      })
    )

    return { scanResults, lastEvaluatedKey: items.LastEvaluatedKey }
  }

  async getItemsByTenant({ lastEvaluatedKey, limit, tenant }: QueryParams): Promise<ScanResult> {
    const scanResults: Array<PageType> = []

    if (!tenant) {
      return { scanResults: [], lastEvaluatedKey: undefined }
    }

    const scanParams: QueryCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      IndexName: 'tenant-index',
      KeyConditionExpression: 'tenant = :tenant',
      ExpressionAttributeValues: {
        ':tenant': { S: tenant }
      },
      ExclusiveStartKey: lastEvaluatedKey
    }

    const items = (await this.client.send(new QueryCommand(scanParams))) as ItemsResult
    items.Items?.forEach((item) =>
      scanResults.push({
        url: item.url?.S ?? '',
        status: item.statusName?.S ?? '',
        code: item.code?.S ?? '',
        keyword: item.keyword?.S ?? ''
      })
    )

    return { scanResults, lastEvaluatedKey: items.LastEvaluatedKey }
  }
}

export { DynamoDBHelper, DynamoDBHelperConfig, DynamoDBCreateItem, DynamoDBUpdateItem, AttributeValue }
