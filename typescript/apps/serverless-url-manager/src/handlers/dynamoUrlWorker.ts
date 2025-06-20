import { SQSEvent } from 'aws-lambda'
import BluebirdPromise from 'bluebird'
import { CrawlerHelper, DynamoDBHelper, DynamoDBUpdateItem } from '../helpers/index.js'
import { CrawlParameters, CrawlResult } from '../types/crawl.js'

interface Item {
  url: string
  [key: string]: string | number | boolean
}

export class DynamoUrlWorker {
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

  public urlCheck = async (event: SQSEvent): Promise<void> => {
    console.log('Try with attempts = ', this.attempts)
    const items = event.Records.reduce((accum, record) => {
      try {
        const parsedBody = JSON.parse(record.body)
        if (parsedBody && Array.isArray(parsedBody.urlToFetch)) {
          return accum.concat(parsedBody.urlToFetch)
        }
        console.error('Invalid record structure - urlToFetch is not an array:', record.messageId)
        return accum
      } catch (error) {
        console.error('Error parsing record body:', error, 'Record ID:', record.messageId)
        return accum
      }
    }, [] as Item[])

    // Early return if no valid items to process
    if (!items.length) {
      console.log('No valid items to process')
      return
    }
    const urlResponsePromises = await BluebirdPromise.map(
      items,
      (item: Item) =>
        BluebirdPromise.delay(3000).then(() => {
          const params: CrawlParameters = {
            url: item.url,
            status: item.status as string,
            statusCode: item.code as number,
            urlKeyword: item.keyword as string
          }
          return this.crawler.crawlPage(params)
        }),
      { concurrency: 1 }
    )
    const urlResponse: Array<CrawlResult | undefined> = await BluebirdPromise.all(urlResponsePromises)
    const jobs = urlResponse.filter(Boolean).map((crawledPage) => {
      const reportRecord: CrawlResult = crawledPage!
      const item: DynamoDBUpdateItem = {
        url: reportRecord.url,
        status: reportRecord.status,
        previousStatus: reportRecord.previousStatus ?? '',
        code: reportRecord.code.toString(),
        previousCode: reportRecord.previousCode?.toString() ?? '',
        attempts: this.attempts.toString(),
        headers: reportRecord.headers,
        urlKeyword: reportRecord.urlKeyword ?? ''
      }
      return this.dynamodb.updateItem(item)
    })
    await Promise.allSettled(jobs)
    console.log(`Finished url check`)
  }
}
