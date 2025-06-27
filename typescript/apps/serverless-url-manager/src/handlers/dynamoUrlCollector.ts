// handlers/dynamoUrlCollector.ts

import { APIGatewayEvent, SQSEvent } from 'aws-lambda'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { DynamoDBHelper, SQSHelper } from '../helpers/index.js'
import { APIDoctifyEvent } from '../types/urls.js'
import { LambdaResponse } from '../types/base.js'

export class DynamoUrlCollector {
  private readonly dynamodb: DynamoDBHelper

  private readonly sqs: SQSHelper

  private readonly chunkSize: number

  private readonly limit: number

  constructor({
    dynamodb,
    sqs,
    chunkSize = Number(process.env.CHUNK_COUNT ?? 3),
    limit = 100
  }: {
    dynamodb: DynamoDBHelper
    sqs: SQSHelper
    chunkSize?: number
    limit?: number
  }) {
    this.dynamodb = dynamodb
    this.sqs = sqs
    this.chunkSize = chunkSize
    this.limit = limit
  }

  private chunkedItems(items: APIDoctifyEvent[]): { urlToFetch: APIDoctifyEvent[] }[] {
    return Array.from({ length: Math.ceil(items.length / this.chunkSize) }, (_, i) => ({
      urlToFetch: items.slice(i * this.chunkSize, (i + 1) * this.chunkSize)
    }))
  }

  private async processDynamoDBFetch(
    tenant?: string,
    lastEvaluatedKey?: Record<string, AttributeValue>
  ): Promise<void> {
    const { scanResults, lastEvaluatedKey: newLastEvaluatedKey } = tenant
      ? await this.dynamodb.getItemsByTenant({ limit: this.limit, tenant, lastEvaluatedKey })
      : await this.dynamodb.getAllItems({ limit: this.limit, lastEvaluatedKey })

    const resultSpec = this.chunkedItems(scanResults)
    await this.sqs.sendBatchToSqs(resultSpec, process.env.CRAWL_URL_SQS as string)

    if (newLastEvaluatedKey) {
      await this.sqs.sendOneToSQS(
        { lastEvaluatedKey: newLastEvaluatedKey, tenant },
        process.env.DYNAMO_QUERY_URL_SQS as string
      )
    }
  }

  public startDynamoDBFetch = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    try {
      const body = event.body ? JSON.parse(event.body) : {}
      await this.processDynamoDBFetch(body.tenant)
    } catch (error) {
      console.error('Error in startDynamoDBFetch:', error)
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Success' })
    }
  }

  public continueDynamoFetch = async (sqsEvent: SQSEvent): Promise<void> => {
    try {
      const body = JSON.parse(sqsEvent.Records[0].body)
      await this.processDynamoDBFetch(body.tenant, body.lastEvaluatedKey)
    } catch (error) {
      console.error('Error in continueDynamoFetch:', error)
    }
  }
}
