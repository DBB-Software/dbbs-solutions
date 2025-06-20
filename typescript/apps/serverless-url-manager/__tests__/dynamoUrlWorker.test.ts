import { describe, beforeEach, jest, test, expect } from '@jest/globals'
import { SQSEvent } from 'aws-lambda'

import { CrawlParameters, CrawlResult } from '../src/types/crawl.js'
import { CrawlerHelper, DynamoDBHelper, DynamoDBUpdateItem } from '../src/helpers/index.js'
import { DynamoUrlWorker } from '../src/handlers/dynamoUrlWorker.js'

const MOCKED_ENV = {
  REGION: 'eu-central-1',
  DB_TABLE: 'test-sitemap-urls-stage',
  STAGE: 'test',
  NUMBER_OF_ATTEMPTS: '2'
}

const mockCrawlPage = jest.fn<(params: CrawlParameters) => Promise<CrawlResult | undefined>>()
const mockUpdateItem = jest.fn<(item: DynamoDBUpdateItem) => Promise<void>>()

// Mock CrawlerHelper
const mockCrawler = {
  crawlPage: mockCrawlPage
} as unknown as CrawlerHelper

// Mock DynamoDBHelper
const mockDynamoDB = {
  updateItem: mockUpdateItem
} as unknown as DynamoDBHelper

describe('dynamoUrlWorker', () => {
  let worker: DynamoUrlWorker
  
  function clearEnvVariable(variable: string = '') {
    process.env[variable] = ''
  }

  beforeEach(() => {
    jest.clearAllMocks()
    Object.entries(MOCKED_ENV).forEach(([key, value]) => {
      process.env[key] = value
    })
    
    // Create a new worker instance for each test
    worker = new DynamoUrlWorker({ dynamodb: mockDynamoDB, crawler: mockCrawler })
  })

  describe('urlCheck', () => {
    const mockSQSEvent: SQSEvent = {
      Records: [{
        messageId: 'test-message-id',
        receiptHandle: 'test-receipt-handle',
        body: JSON.stringify({
          urlToFetch: [
            {
              url: 'https://example1.com',
              status: 'active',
              code: '200', // Changed to string to match expected format
              keyword: 'test-keyword-1'
            }
          ]
        }),
        attributes: {} as any,
        messageAttributes: {},
        md5OfBody: 'test-md5',
        eventSource: 'aws:sqs',
        eventSourceARN: 'test-arn',
        awsRegion: 'eu-central-1'
      }]
    }

    test('should successfully process URL checks and update DynamoDB', async () => {
      const mockCrawlResults: CrawlResult = {
        url: 'https://example1.com',
        status: 'OK', // This is the statusText from the crawler
        previousStatus: 'active', // This is the original status from input
        code: 200,
        previousCode: 200, // This is the original code from input as string
        fetchedAt: new Date().toISOString(),
        headers: [{ S: JSON.stringify({ 'content-type': 'text/html' }) }], // Array format as expected
        urlKeyword: 'test-keyword-1'
      }

      mockCrawlPage.mockResolvedValueOnce(mockCrawlResults)
      mockUpdateItem.mockResolvedValue(undefined)

      await worker.urlCheck(mockSQSEvent)

      expect(mockCrawlPage).toHaveBeenCalledTimes(1)
      expect(mockCrawlPage).toHaveBeenCalledWith({
        url: 'https://example1.com',
        status: 'active',
        statusCode: '200', // Note: statusCode, not code
        urlKeyword: 'test-keyword-1'
      })

      expect(mockUpdateItem).toHaveBeenCalledTimes(1)
      expect(mockUpdateItem).toHaveBeenCalledWith({
        url: 'https://example1.com',
        status: 'OK', // statusText from crawler
        previousStatus: 'active', // original status from input
        code: '200',
        previousCode: '200', // original code from input
        attempts: '1',
        headers: [{ S: JSON.stringify({ 'content-type': 'text/html' }) }], // Array format
        urlKeyword: 'test-keyword-1'
      })
    })

    test('should handle crawl failures gracefully', async () => {
      mockCrawlPage.mockResolvedValueOnce(undefined) // Crawl fails
      mockUpdateItem.mockResolvedValue(undefined)

      await worker.urlCheck(mockSQSEvent)

      expect(mockCrawlPage).toHaveBeenCalledTimes(1)
      // When crawl fails, updateItem should not be called
      expect(mockUpdateItem).not.toHaveBeenCalled()
    })

    test('should handle multiple SQS records', async () => {
      const multiRecordEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id-1',
            receiptHandle: 'test-receipt-handle-1',
            body: JSON.stringify({
              urlToFetch: [
                {
                  url: 'https://example1.com',
                  status: 'active',
                  code: '200', // String format
                  keyword: 'keyword-1'
                }
              ]
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5-1',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn-1',
            awsRegion: 'eu-central-1'
          },
          {
            messageId: 'test-message-id-2',
            receiptHandle: 'test-receipt-handle-2',
            body: JSON.stringify({
              urlToFetch: [
                {
                  url: 'https://example2.com',
                  status: 'inactive',
                  code: '404', // String format
                  keyword: 'keyword-2'
                }
              ]
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5-2',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn-2',
            awsRegion: 'eu-central-1'
          }
        ]
      }

      // Fix the mock implementation to properly handle the parameters
      mockCrawlPage.mockImplementation(async (params: CrawlParameters) => {
        console.log('Mock crawlPage called with:', params) // Debug log
        
        if (params.url === 'https://example1.com') {
          return {
            url: 'https://example1.com',
            status: 'OK',
            code: 200,
            urlKeyword: 'keyword-1',
            headers: [],
            fetchedAt: new Date().toISOString(),
            previousCode: 200, // String format
            previousStatus: 'active'
          }
        }
        if (params.url === 'https://example2.com') {
          return {
            url: 'https://example2.com',
            status: 'Not Found',
            code: 404,
            urlKeyword: 'keyword-2',
            headers: [],
            fetchedAt: new Date().toISOString(),
            previousCode: 404, // String format
            previousStatus: 'inactive'
          }
        }
        return undefined
      })

      mockUpdateItem.mockResolvedValue(undefined)

      await worker.urlCheck(multiRecordEvent)

      expect(mockCrawlPage).toHaveBeenCalledTimes(2)
      expect(mockUpdateItem).toHaveBeenCalledTimes(2)
      
      // Verify the first call
      expect(mockCrawlPage).toHaveBeenNthCalledWith(1, {
        url: 'https://example1.com',
        status: 'active',
        statusCode: '200',
        urlKeyword: 'keyword-1'
      })
      
      // Verify the second call
      expect(mockCrawlPage).toHaveBeenNthCalledWith(2, {
        url: 'https://example2.com',
        status: 'inactive',
        statusCode: '404',
        urlKeyword: 'keyword-2'
      })
    })

    test('should handle DynamoDB update failures', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockCrawlPage.mockResolvedValue({
        url: 'https://example1.com',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousCode: 200, // String format
        previousStatus: 'active',
        urlKeyword: 'test-keyword-1'
      })

      mockUpdateItem.mockRejectedValue(new Error('DynamoDB update failed'))

      // Should not throw error due to Promise.allSettled usage
      await expect(worker.urlCheck(mockSQSEvent)).resolves.not.toThrow()
    })

    test('should use default values when environment variables are missing', async () => {
      clearEnvVariable('NUMBER_OF_ATTEMPTS')
      clearEnvVariable('REGION')
      clearEnvVariable('DB_TABLE')

      mockCrawlPage.mockResolvedValue({
        url: 'https://example1.com',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousCode: 200,
        previousStatus: 'active',
        urlKeyword: 'test-keyword-1'
      })

      mockUpdateItem.mockResolvedValue(undefined)

      await worker.urlCheck(mockSQSEvent)

      expect(mockCrawlPage).toHaveBeenCalledTimes(1)
      expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    })

    test('should handle empty SQS records', async () => {
      const emptySQSEvent: SQSEvent = {


        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({ urlToFetch: [] }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-central-1'
        }]
      }

      await worker.urlCheck(emptySQSEvent)

      expect(mockCrawlPage).not.toHaveBeenCalled()
      expect(mockUpdateItem).not.toHaveBeenCalled()
    })

    test('should handle malformed SQS body', async () => {
      const malformedSQSEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: 'invalid json',
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-central-1'
        }]
      }
    
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
      await worker.urlCheck(malformedSQSEvent)
    
      // Updated to match the exact error logging format from the implementation
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error parsing record body:', 
        expect.any(Error), 
        'Record ID:', 
        'test-message-id'
      )
      expect(mockCrawlPage).not.toHaveBeenCalled()
      expect(mockUpdateItem).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    test('should handle valid JSON with invalid structure', async () => {
      const invalidStructureEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id-2',
          receiptHandle: 'test-receipt-handle-2',
          body: JSON.stringify({ someOtherField: 'value' }), // Missing urlToFetch
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5-2',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn-2',
          awsRegion: 'eu-central-1'
        }]
      }
    
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
      await worker.urlCheck(invalidStructureEvent)
    
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid record structure - urlToFetch is not an array:', 
        'test-message-id-2'
      )
      expect(mockCrawlPage).not.toHaveBeenCalled()
      expect(mockUpdateItem).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
    
    test('should handle urlToFetch that is not an array', async () => {
      const nonArrayEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id-3',
          receiptHandle: 'test-receipt-handle-3',
          body: JSON.stringify({ urlToFetch: 'not-an-array' }), // urlToFetch is not an array
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5-3',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn-3',
          awsRegion: 'eu-central-1'
        }]
      }
    
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
      await worker.urlCheck(nonArrayEvent)
    
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid record structure - urlToFetch is not an array:', 
        'test-message-id-3'
      )
      expect(mockCrawlPage).not.toHaveBeenCalled()
      expect(mockUpdateItem).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
    
    test('should handle mixed valid and invalid records', async () => {
      const mixedEvent: SQSEvent = {
        Records: [
          {
            messageId: 'valid-record',
            receiptHandle: 'test-receipt-handle-valid',
            body: JSON.stringify({
              urlToFetch: [{
                url: 'https://example.com',
                status: 'active',
                code: '200',
                keyword: 'test-keyword'
              }]
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5-valid',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn-valid',
            awsRegion: 'eu-central-1'
          },
          {
            messageId: 'invalid-record',
            receiptHandle: 'test-receipt-handle-invalid',
            body: 'invalid json',
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5-invalid',
            eventSource: 'aws:sqs',
            eventSourceARN: 'test-arn-invalid',
            awsRegion: 'eu-central-1'
          }
        ]
      }
    
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockCrawlPage.mockResolvedValue({
        url: 'https://example.com',
        status: 'OK',
        code: 200,
        headers: [],
        fetchedAt: new Date().toISOString(),
        previousCode: 200,
        previousStatus: 'active',
        urlKeyword: 'test-keyword'
      })
      
      mockUpdateItem.mockResolvedValue(undefined)
    
      await worker.urlCheck(mixedEvent)
    
      // Should log error for invalid record
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error parsing record body:', 
        expect.any(Error), 
        'Record ID:', 
        'invalid-record'
      )
      
      // Should still process the valid record
      expect(mockCrawlPage).toHaveBeenCalledTimes(1)
      expect(mockUpdateItem).toHaveBeenCalledTimes(1)
      
      consoleSpy.mockRestore()
    })
  })
})
