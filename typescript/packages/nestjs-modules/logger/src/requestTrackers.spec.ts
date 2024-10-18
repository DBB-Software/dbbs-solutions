import { APIGatewayEvent, Context } from 'aws-lambda'
import { IncomingMessage } from 'http'
import { lambdaRequestTracker, serverRequestTracker } from './requestTrackers.js'

describe('requestTrackers', () => {
  const mockedApiReqId = '111'
  const mockedAwsReqId = '222'
  const mockedCorrelationHeader = 'test-header'
  const mockedAmazonTraceId = '3333'

  afterEach(jest.clearAllMocks)

  describe('lambdaRequestTracker', () => {
    it('should return correct ids from event / context', () => {
      const input = {
        event: {
          requestContext: { requestId: mockedApiReqId },
          headers: { 'x-correlation-test': mockedCorrelationHeader } as any
        },
        context: { awsRequestId: mockedAwsReqId }
      } as { event: APIGatewayEvent; context: Context }
      const expectedResult = {
        awsRequestId: mockedAwsReqId,
        apiRequestId: mockedApiReqId,
        'x-correlation-id': mockedAwsReqId,
        'x-correlation-test': mockedCorrelationHeader
      }
      const result = lambdaRequestTracker(input)

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return correct ids from event / context with amazon trace id', () => {
      const input = {
        event: { requestContext: { requestId: mockedApiReqId } },
        context: { awsRequestId: mockedAwsReqId }
      } as { event: APIGatewayEvent; context: Context }
      const expectedResult = {
        awsRequestId: mockedAwsReqId,
        apiRequestId: mockedApiReqId,
        'x-correlation-id': mockedAwsReqId,
        'x-correlation-trace-id': mockedAmazonTraceId
      }
      process.env['_X_AMZN_TRACE_ID'] = mockedAmazonTraceId
      const result = lambdaRequestTracker(input)

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('serverRequestTracker', () => {
    it('should return correct ids from request obj', () => {
      const input = {
        headers: {
          apiRequestId: mockedApiReqId,
          awsRequestId: mockedAwsReqId,
          'x-correlation-id': mockedAwsReqId,
          _X_AMZN_TRACE_ID: mockedAmazonTraceId,
          'x-correlation-test': mockedCorrelationHeader
        }
      } as any
      const expectedResult = {
        awsRequestId: mockedAwsReqId,
        apiRequestId: mockedApiReqId,
        'x-correlation-id': mockedAwsReqId,
        'x-correlation-trace-id': mockedAmazonTraceId,
        'x-correlation-test': mockedCorrelationHeader
      }
      const result = serverRequestTracker(input)

      expect(result).toStrictEqual(expectedResult)
    })

    it('should generate ids without grabbing from req obj', () => {
      const input = { headers: {} } as IncomingMessage
      const result = serverRequestTracker(input)

      expect(result['x-correlation-id']).toBeDefined()
      expect(result.awsRequestId).toBeDefined()
      expect(result.apiRequestId).toBeDefined()
    })
  })
})
