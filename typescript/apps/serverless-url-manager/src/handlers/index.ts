import { CrawlerHelper, DynamoDBHelper, SitemapHelper, SQSHelper } from '../helpers/index.js'

import { DynamoUrlCollector } from './dynamoUrlCollector.js'
import { DynamoUrlWorker } from './dynamoUrlWorker.js'
import { SitemapCollector } from './sitemapCollector.js'
import { SitemapLoader } from './sitemapUrlLoader.js'

const tableName = process.env.DB_TABLE ?? `sitemap-urls-${process.env.STAGE}`
const region = process.env.REGION ?? 'eu-west-2'
const attempts = parseInt(process.env.NUMBER_OF_ATTEMPTS ?? '1', 10)
const sqs = new SQSHelper(region)
const dynamodb = new DynamoDBHelper({ region, tableName })
const crawler = new CrawlerHelper(attempts)

const dynamoCollector = new DynamoUrlCollector({ dynamodb, sqs })
const dynamoWorker = new DynamoUrlWorker({ dynamodb, crawler, attempts })
const sitemapCollector = new SitemapCollector({ sitemap: new SitemapHelper(), sqs })
const sitemapLoader = new SitemapLoader({ dynamodb, crawler, attempts })

export const { startDynamoDBFetch, continueDynamoFetch } = dynamoCollector
export const { urlCheck } = dynamoWorker
export const { startSitemapFetch } = sitemapCollector
export const { loadUrl } = sitemapLoader
