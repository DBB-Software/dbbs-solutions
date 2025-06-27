import { CustomSqsHandler } from '@dbbs/common'
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs'

const chunking = <T>(array: T[], size: number): T[][] =>
  Array(Math.ceil(array.length / size))
    .fill(undefined)
    .map((_, index) => index * size)
    .map((begin) => array.slice(begin, begin + size))

interface SqsResponse {
  message: string
  result: SendMessageCommandOutput
}

interface SQSMessageData {
  [key: string]: unknown
}

export class SQSHelper {
  private readonly sqsHandler: CustomSqsHandler

  constructor(region: string) {
    this.sqsHandler = new CustomSqsHandler(region)
  }

  async sendOneToSQS(data: SQSMessageData, sqsUrl: string): Promise<SqsResponse> {
    try {
      const result = await this.sqsHandler.sendToSQS(data, sqsUrl ?? (process.env.CRAWL_URL_SQS as string))

      return { message: 'success', result }
    } catch (err) {
      console.error((err as Error).message, err)
      throw new Error((err as Error).message)
    }
  }

  async sendBatchToSqs(messages: SQSMessageData[], sqsUrl: string) {
    const BATCH_SIZE = 10
    const chunks = chunking(messages, BATCH_SIZE)
    console.log(`Start sending of ${chunks.length} chunks`)

    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunks) {
      try {
        await this.sqsHandler.sendBatchToSQS(chunk, sqsUrl ?? (process.env.CRAWL_URL_SQS as string))
      } catch (error) {
        console.error('Failed to send batch:', (error as Error).message)
      }
    }
  }
}
