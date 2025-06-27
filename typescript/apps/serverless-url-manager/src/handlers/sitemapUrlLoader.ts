import { SQSEvent } from 'aws-lambda'
import { DynamoDBHelper, CrawlerHelper } from '../helpers/index.js'

export class SitemapLoader {
  private readonly dynamodb: DynamoDBHelper

  private readonly crawler: CrawlerHelper

  private readonly attempts: number

  constructor({
    dynamodb,
    crawler,
    attempts = 1
  }: {
    dynamodb: DynamoDBHelper
    crawler: CrawlerHelper
    attempts?: number
  }) {
    this.dynamodb = dynamodb
    this.crawler = crawler
    this.attempts = attempts
  }

  public loadUrl = async (event: SQSEvent): Promise<void> => {
    const { urlInput, urlKeyword = '' } = JSON.parse(event.Records[0].body)
    const urlObj = new URL(urlInput)
    const keywordPart = urlKeyword ? ` with keyword ${urlKeyword}` : ''
    console.log(`Received url ${urlInput}${keywordPart}`)
    const pathItems = urlObj.pathname.split('/')
    const tenant = pathItems[1]
    const contentType = pathItems.length > 3 ? pathItems[2] : ''
    const crawlResult = await this.crawler.crawlPage({
      url: urlInput,
      urlKeyword,
      status: '',
      statusCode: 0
    })
    await this.dynamodb.createItem({
      url: urlInput,
      tenant,
      contentType,
      keyword: urlKeyword.toString(),
      headers: crawlResult?.headers ?? [],
      code: crawlResult?.code?.toString() ?? '',
      status: crawlResult?.status ?? '',
      attempts: this.attempts.toString(),
      previousStatus: '',
      previousCode: ''
    })
    console.info(`Finished loading`)
  }
}
