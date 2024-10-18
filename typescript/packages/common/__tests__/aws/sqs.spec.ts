import { SQSClient } from '@aws-sdk/client-sqs'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomSqsHandler } from '../../src/aws/sqs.js'

jest.mock('@aws-sdk/client-sqs', () => ({
  ...jest.requireActual('@aws-sdk/client-sqs'),
  SQSClient: jest.fn().mockImplementation(() => {
    return { send: jest.fn() }
  })
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomSqsHandler', () => {
  const mockedQueueUrl: string = 'test_sqs_url'
  const mockedData: object = { key: 'value' }
  const mockedRegion: string = 'eu-central-1'

  afterEach(jest.clearAllMocks)

  describe('constructor (SQS Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize SQS client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize SQS client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomSqsHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(SQSClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('sendToSQS', () => {
    test.each([
      {
        description: 'should send a message to the specified SQS URL with correct input params',
        input: {
          data: mockedData,
          queueUrl: mockedQueueUrl
        },
        expectedCallInput: {
          MessageBody: JSON.stringify(mockedData),
          QueueUrl: mockedQueueUrl
        }
      },
      {
        description: 'should send a message to the specified SQS URL with wrong input params',
        input: {
          data: null,
          queueUrl: null
        } as any,
        expectedCallInput: {
          MessageBody: JSON.stringify(null),
          QueueUrl: undefined
        }
      },
      {
        description: 'should use a default queueUrl for sending a data to queue',
        queueUrl: 'test',
        input: {
          data: mockedData,
          queueUrl: undefined
        },
        expectedCallInput: {
          MessageBody: JSON.stringify(mockedData),
          QueueUrl: 'test'
        }
      }
    ])('$description', async ({ input, expectedCallInput, queueUrl }) => {
      const sqsHandler = new CustomSqsHandler(mockedRegion, false, queueUrl)

      await sqsHandler.sendToSQS(input.data, input.queueUrl)

      expect(sqsHandler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })
  })
})
