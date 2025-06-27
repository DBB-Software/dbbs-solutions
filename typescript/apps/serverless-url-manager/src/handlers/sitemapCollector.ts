import { SitemapHelper, SQSHelper } from '../helpers/index.js'
import { LambdaResponse } from '../types/base.js'

export class SitemapCollector {
  private readonly sitemap: SitemapHelper

  private readonly sqs: SQSHelper

  private readonly urlToFetch: string

  constructor({ sitemap, sqs }: { sitemap: SitemapHelper; sqs: SQSHelper }) {
    this.sitemap = sitemap
    this.sqs = sqs
    this.urlToFetch = `${process.env.SITE_URL}/sitemap.xml`
  }

  public startSitemapFetch = async (): Promise<LambdaResponse> => {
    console.info(`Begin fetch of the urls from domain ${this.urlToFetch}`)
    const response = await this.sitemap.fetchSitemap(this.urlToFetch)
    console.log('Length of URLS: ', response.length)
    await this.sqs.sendBatchToSqs(
      response.map((url) => ({ urlInput: url })),
      process.env.LOAD_URL_SQS as string
    )
    console.info(`Finished crawling`)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Success' })
    }
  }
}
