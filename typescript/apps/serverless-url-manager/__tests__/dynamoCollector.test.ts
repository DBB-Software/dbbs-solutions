import { jest } from '@jest/globals'

import { DynamoUrlCollector } from '../src/handlers/dynamoUrlCollector.js'
import { QueryParams, ScanResult } from '../src/types/urls.js'
import { APIGatewayEvent, SQSEvent } from 'aws-lambda'
import { DynamoDBHelper } from '../src/helpers/dynamodb.helper.js'
import { SQSHelper } from '../src/helpers/sqs.helper.js'

// Mock environment variables
const MOCKED_ENV = {
  DB_TABLE: 'test-sitemap-urls-stage',
  REGION: 'eu-west-2',
  CHUNK_COUNT: '3',
  STAGE: 'test',
  CRAWL_URL_SQS: 'crawl-sqs-url',
  DYNAMO_QUERY_URL_SQS: 'dynamo-query-sqs-url'
}

// Create proper mocks for the helper classes with correct typing
const mockGetItemsByTenant = jest.fn<(params: QueryParams) => Promise<ScanResult>>()
const mockGetAllItems = jest.fn<(params: QueryParams) => Promise<ScanResult>>()
const mockSendBatchToSqs = jest.fn<(chunks: any[], queueUrl: string) => Promise<void>>()
const mockSendOneToSQS = jest.fn<(message: any, queueUrl: string) => Promise<void>>()

// Mock DynamoDB helper with proper structure
const mockDynamoDB = {
  client: {},
  tableName: 'mock-table',
  getItemsByTenant: mockGetItemsByTenant,
  getAllItems: mockGetAllItems
} as unknown as DynamoDBHelper

// Mock SQS helper
const mockSQS = {
  sendBatchToSqs: mockSendBatchToSqs,
  sendOneToSQS: mockSendOneToSQS
} as unknown as SQSHelper

describe('dynamoUrlCollector', () => {
  let collector: DynamoUrlCollector

  beforeEach(() => {
    jest.clearAllMocks()
    Object.entries(MOCKED_ENV).forEach(([key, value]) => {
      process.env[key] = value
    })
    
    // Create a new collector instance for each test
    collector = new DynamoUrlCollector({ dynamodb: mockDynamoDB, sqs: mockSQS })
  })

  describe('startDynamoDBFetch', () => {
    it('fetches by tenant and sends to SQS, then sends next key if present', async () => {
      const mockScanResults = [
        { url: 'https://a.com', status: 'active', code: '200', keyword: 'k1' },
        { url: 'https://b.com', status: 'active', code: '200', keyword: 'k2' }
      ]
      const mockLastEvaluatedKey = { url: { S: 'https://b.com' } }
      
      // Mock the getItemsByTenant method to return our test data
      mockGetItemsByTenant.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: mockLastEvaluatedKey
      })

      const event: APIGatewayEvent = {
        body: JSON.stringify({ tenant: 'test-tenant' }),
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '/start',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: ''
      }

      // Call the method on the collector instance
      await collector.startDynamoDBFetch(event)

      // Verify the correct method was called with correct parameters
      expect(mockGetItemsByTenant).toHaveBeenCalledWith({
        limit: 100,
        tenant: 'test-tenant',
        lastEvaluatedKey: undefined
      })
      
      // Verify batch was sent to SQS with chunked results
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [{ urlToFetch: mockScanResults }],
        'crawl-sqs-url'
      )
      
      // Verify continuation message was sent
      expect(mockSendOneToSQS).toHaveBeenCalledWith(
        { lastEvaluatedKey: mockLastEvaluatedKey, tenant: 'test-tenant' },
        'dynamo-query-sqs-url'
      )
    })

    it('handles empty body gracefully', async () => {
      const mockScanResults = [
        { url: 'https://c.com', status: 'active', code: '200', keyword: 'k3' }
      ]
      
      // Mock getAllItems for when no tenant is provided
      mockGetAllItems.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: undefined
      })

      const event: APIGatewayEvent = {
        body: null, // No body provided
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '/start',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: ''
      }

      await collector.startDynamoDBFetch(event)

      // Should call getAllItems when no tenant is provided
      expect(mockGetAllItems).toHaveBeenCalledWith({
        limit: 100,
        lastEvaluatedKey: undefined
      })
      
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [{ urlToFetch: mockScanResults }],
        'crawl-sqs-url'
      )
      
      // Should not send continuation message when no lastEvaluatedKey
      expect(mockSendOneToSQS).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockGetItemsByTenant.mockRejectedValue(new Error('DynamoDB error'))

      const event: APIGatewayEvent = {
        body: JSON.stringify({ tenant: 'test-tenant' }),
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '/start',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: ''
      }

      await collector.startDynamoDBFetch(event)

      expect(consoleSpy).toHaveBeenCalledWith('Error in startDynamoDBFetch:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('continueDynamoFetch', () => {
    it('continues fetching with tenant and lastEvaluatedKey from SQS message', async () => {
      const mockScanResults = [
        { url: 'https://d.com', status: 'active', code: '200', keyword: 'k4' },
        { url: 'https://e.com', status: 'inactive', code: '404', keyword: 'k5' }
      ]
      const mockLastEvaluatedKey = { url: { S: 'https://c.com' } }
      const mockNewLastEvaluatedKey = { url: { S: 'https://e.com' } }

      mockGetItemsByTenant.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: mockNewLastEvaluatedKey
      })

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            tenant: 'test-tenant',
            lastEvaluatedKey: mockLastEvaluatedKey
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      // Verify getItemsByTenant was called with the lastEvaluatedKey from SQS
      expect(mockGetItemsByTenant).toHaveBeenCalledWith({
        limit: 100,
        tenant: 'test-tenant',
        lastEvaluatedKey: mockLastEvaluatedKey
      })

      // Verify batch was sent to SQS
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [{ urlToFetch: mockScanResults }],
        'crawl-sqs-url'
      )

      // Verify continuation message was sent with new lastEvaluatedKey
      expect(mockSendOneToSQS).toHaveBeenCalledWith(
        { lastEvaluatedKey: mockNewLastEvaluatedKey, tenant: 'test-tenant' },
        'dynamo-query-sqs-url'
      )
    })

    it('continues fetching without tenant (scan all items)', async () => {
      const mockScanResults = [
        { url: 'https://f.com', status: 'active', code: '200', keyword: 'k6' }
      ]
      const mockLastEvaluatedKey = { url: { S: 'https://e.com' } }

      mockGetAllItems.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: undefined // No more items
      })

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            lastEvaluatedKey: mockLastEvaluatedKey
            // No tenant provided
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      // Should call getAllItems when no tenant is provided
      expect(mockGetAllItems).toHaveBeenCalledWith({
        limit: 100,
        lastEvaluatedKey: mockLastEvaluatedKey
      })

      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [{ urlToFetch: mockScanResults }],
        'crawl-sqs-url'
      )

      // Should not send continuation message when no more items
      expect(mockSendOneToSQS).not.toHaveBeenCalled()
    })

    it('handles large result sets with chunking', async () => {
      // Create 7 items to test chunking (with chunkSize=3, should create 3 chunks)
      const mockScanResults = Array.from({ length: 7 }, (_, i) => ({
        url: `https://example${i}.com`,
        status: 'active',
        code: '200',
        keyword: `keyword${i}`
      }))

      mockGetItemsByTenant.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: undefined
      })

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            tenant: 'test-tenant',
            lastEvaluatedKey: { url: { S: 'https://start.com' } }
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      // Verify chunking: 7 items with chunkSize=3 should create 3 chunks
      const expectedChunks = [
        { urlToFetch: mockScanResults.slice(0, 3) },
        { urlToFetch: mockScanResults.slice(3, 6) },
        { urlToFetch: mockScanResults.slice(6, 7) }
      ]

      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        expectedChunks,
        'crawl-sqs-url'
      )
    })

    it('handles malformed SQS message body', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: 'invalid json', // Malformed JSON
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      expect(consoleSpy).toHaveBeenCalledWith('Error in continueDynamoFetch:', expect.any(Error))
      expect(mockGetItemsByTenant).not.toHaveBeenCalled()
      expect(mockGetAllItems).not.toHaveBeenCalled()
      expect(mockSendBatchToSqs).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('handles DynamoDB errors during continuation', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      mockGetItemsByTenant.mockRejectedValue(new Error('DynamoDB scan failed'))

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            tenant: 'test-tenant',
            lastEvaluatedKey: { url: { S: 'https://test.com' } }
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      expect(consoleSpy).toHaveBeenCalledWith('Error in continueDynamoFetch:', expect.any(Error))
      expect(mockSendBatchToSqs).not.toHaveBeenCalled()
      expect(mockSendOneToSQS).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('handles SQS sending errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const mockScanResults = [
        { url: 'https://test.com', status: 'active', code: '200', keyword: 'test' }
      ]

      mockGetItemsByTenant.mockResolvedValue({
        scanResults: mockScanResults,
        lastEvaluatedKey: undefined
      })

      // Mock SQS to fail - Fixed typing issue
      mockSendBatchToSqs.mockImplementation(() => Promise.reject(new Error('SQS send failed')))

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            tenant: 'test-tenant',
            lastEvaluatedKey: { url: { S: 'https://test.com' } }
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      expect(consoleSpy).toHaveBeenCalledWith('Error in continueDynamoFetch:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('handles empty scan results', async () => {
      mockGetItemsByTenant.mockResolvedValue({
        scanResults: [], // Empty results
        lastEvaluatedKey: undefined
      })

      const sqsEvent: SQSEvent = {
        Records: [{
          messageId: 'test-message-id',
          receiptHandle: 'test-receipt-handle',
          body: JSON.stringify({
            tenant: 'test-tenant',
            lastEvaluatedKey: { url: { S: 'https://test.com' } }
          }),
          attributes: {} as any,
          messageAttributes: {},
          md5OfBody: 'test-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'test-arn',
          awsRegion: 'eu-west-2'
        }]
      }

      await collector.continueDynamoFetch(sqsEvent)

      expect(mockGetItemsByTenant).toHaveBeenCalledWith({
        limit: 100,
        tenant: 'test-tenant',
        lastEvaluatedKey: { url: { S: 'https://test.com' } }
      })

      // Should still send empty batch to SQS
      expect(mockSendBatchToSqs).toHaveBeenCalledWith(
        [],
        'crawl-sqs-url'
      )

      // Should not send continuation message
      expect(mockSendOneToSQS).not.toHaveBeenCalled()
    })
  })
})
