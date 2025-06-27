import { jest } from '@jest/globals'
import { SQSEvent } from 'aws-lambda'

import { SitemapLoader } from '../src/handlers/sitemapUrlLoader.js'
import { DynamoDBHelper, CrawlerHelper, DynamoDBCreateItem } from '../src/helpers/index.js'
import { CrawlParameters, CrawlResult } from '../src/types/crawl.js'

// Mock environment variables
const MOCKED_ENV = {
  REGION: 'eu-west-2',
  DB_TABLE: 'test-sitemap-urls-stage',
  STAGE: 'test',
  NUMBER_OF_ATTEMPTS: '3'
}

// Create proper mocks for the helper classes
const mockCrawlPage = jest.fn<(params: CrawlParameters) => Promise<CrawlResult | undefined>>()
const mockCreateItem = jest.fn<(item: DynamoDBCreateItem) => Promise<void>>()

// Mock CrawlerHelper
const mockCrawler = {
  crawlPage: mockCrawlPage
} as unknown as CrawlerHelper

// Mock DynamoDBHelper
const mockDynamoDB = {
  createItem: mockCreateItem
} as unknown as DynamoDBHelper

describe('sitemapUrlLoader', () => {
  let loader: SitemapLoader

  beforeEach(() => {
    jest.clearAllMocks()
    Object.entries(MOCKED_ENV).forEach(([key, value]) => {
      process.env[key] = value
    })

    // Create a new loader instance for each test
    loader = new SitemapLoader({
      dynamodb: mockDynamoDB,
      crawler: mockCrawler,
      attempts: 3
    })
  })

  afterEach(() => {
    // Clean up environment variables
    Object.keys(MOCKED_ENV).forEach((key) => {
      delete process.env[key]
    })
  })

  describe('loadUrl', () => {
    it('should successfully load URL with keyword and create DynamoDB item', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/blog/article-1/specialist-type/slug',
        status: 'OK',
        code: 200,
        headers: [{ S: JSON.stringify({ 'content-type': 'text/html' }) }],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        previousCode: undefined,
        urlKeyword: 'test-keyword'
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/blog/article-1/specialist-type/slug',
              urlKeyword: 'test-keyword'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await loader.loadUrl(sqsEvent)

      // Verify crawler was called with correct parameters
      expect(mockCrawlPage).toHaveBeenCalledWith({
        url: 'https://example.com/blog/article-1/specialist-type/slug',
        urlKeyword: 'test-keyword',
        status: '',
        statusCode: 0
      })

      // Verify DynamoDB item was created with correct data
      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/blog/article-1/specialist-type/slug',
        tenant: 'blog', // Extracted from URL path
        contentType: 'article-1', // Extracted from URL path
        keyword: 'test-keyword',
        headers: [{ S: JSON.stringify({ 'content-type': 'text/html' }) }],
        code: '200',
        status: 'OK',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })

      // Verify console logging
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Received url https://example.com/blog/article-1/specialist-type/slug with keyword test-keyword'
      )
      expect(consoleInfoSpy).toHaveBeenCalledWith('Finished loading')

      consoleLogSpy.mockRestore()
      consoleInfoSpy.mockRestore()
    })

    it('should successfully load URL without keyword', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/products/item-1',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/products/item-1'
              // No urlKeyword provided
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

      await loader.loadUrl(sqsEvent)

      expect(mockCrawlPage).toHaveBeenCalledWith({
        url: 'https://example.com/products/item-1',
        urlKeyword: '',
        status: '',
        statusCode: 0
      })

      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/products/item-1',
        tenant: 'products',
        contentType: '',
        keyword: '', // toString() on undefined
        headers: [],
        code: '200',
        status: 'OK',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })

      expect(consoleLogSpy).toHaveBeenCalledWith('Received url https://example.com/products/item-1')

      consoleLogSpy.mockRestore()
    })

    it('should handle URLs with simple path structure', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/about',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/about',
              urlKeyword: 'about-page'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await loader.loadUrl(sqsEvent)

      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/about',
        tenant: 'about',
        contentType: '', // No third path segment
        keyword: 'about-page',
        headers: [],
        code: '200',
        status: 'OK',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })
    })

    it('should handle root URL', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/',
              urlKeyword: 'homepage'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await loader.loadUrl(sqsEvent)

      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/',
        tenant: '', // Empty string for root path
        contentType: '',
        keyword: 'homepage',
        headers: [],
        code: '200',
        status: 'OK',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })
    })

    it('should handle crawl failure gracefully', async () => {
      mockCrawlPage.mockResolvedValue(undefined) // Crawl fails
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/test',
              urlKeyword: 'test'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

      await loader.loadUrl(sqsEvent)

      expect(mockCrawlPage).toHaveBeenCalledTimes(1)

      // Should still create item with empty values when crawl fails
      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/test',
        tenant: 'test',
        contentType: '',
        keyword: 'test',
        headers: [],
        code: '',
        status: '',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })

      consoleLogSpy.mockRestore()
      consoleInfoSpy.mockRestore()
    })

    it('should handle malformed SQS message body', async () => {
      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: 'invalid json',
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await expect(loader.loadUrl(sqsEvent)).rejects.toThrow()
      expect(mockCrawlPage).not.toHaveBeenCalled()
      expect(mockCreateItem).not.toHaveBeenCalled()
    })

    it('should handle crawler errors', async () => {
      mockCrawlPage.mockRejectedValue(new Error('Crawler failed'))

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/test',
              urlKeyword: 'test'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await expect(loader.loadUrl(sqsEvent)).rejects.toThrow('Crawler failed')
      expect(mockCreateItem).not.toHaveBeenCalled()
    })

    it('should handle DynamoDB creation errors', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/test',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockRejectedValue(new Error('DynamoDB creation failed'))

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/test',
              urlKeyword: 'test'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await expect(loader.loadUrl(sqsEvent)).rejects.toThrow('DynamoDB creation failed')
      expect(mockCrawlPage).toHaveBeenCalledTimes(1)
    })

    it('should handle complex URL paths correctly', async () => {
      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/category/subcategory/item/details',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/category/subcategory/item/details',
              urlKeyword: 'complex-path'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await loader.loadUrl(sqsEvent)

      expect(mockCreateItem).toHaveBeenCalledWith({
        url: 'https://example.com/category/subcategory/item/details',
        tenant: 'category', // First path segment
        contentType: 'subcategory', // Second path segment
        keyword: 'complex-path',
        headers: [],
        code: '200',
        status: 'OK',
        attempts: '3',
        previousStatus: '',
        previousCode: ''
      })
    })

    it('should use default attempts when not provided in constructor', async () => {
      const defaultLoader = new SitemapLoader({
        dynamodb: mockDynamoDB,
        crawler: mockCrawler
        // No attempts provided, should default to 1
      })

      const mockCrawlResult: CrawlResult = {
        url: 'https://example.com/test',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousStatus: '',
        urlKeyword: '',
        previousCode: undefined
      }

      mockCrawlPage.mockResolvedValue(mockCrawlResult)
      mockCreateItem.mockResolvedValue(undefined)

      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              urlInput: 'https://example.com/test',
              urlKeyword: 'test'
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn',
            awsRegion: 'eu-west-2'
          }
        ]
      }

      await defaultLoader.loadUrl(sqsEvent)

      expect(mockCreateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          attempts: '1' // Default value
        })
      )
    })
  })
})
