import { SNSClient } from '@aws-sdk/client-sns'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomSnsHandler } from '../../src/aws/sns.js'

jest.mock('@aws-sdk/client-sns', () => ({
  ...jest.requireActual('@aws-sdk/client-sns'),
  SNSClient: jest.fn().mockImplementation(() => {
    return { send: jest.fn() }
  })
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomSnsHandler', () => {
  const mockedRegion: string = 'eu-central-1'
  const mockedData: object = { key: 'value' }

  afterEach(jest.clearAllMocks)

  describe('constructor (SNS Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize SNS client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize SNS client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomSnsHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(SNSClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('publishMessageToSNS', () => {
    test.each([
      {
        description: 'should publish a message to SNS with correct input params',
        input: {
          data: mockedData,
          snsTopic: 'arn:aws:sns:us-east-1:123456789012:MyTopic'
        },
        expectedCallInput: {
          Message: JSON.stringify(mockedData),
          TopicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic'
        }
      },
      {
        description: 'should publish a message to SNS with wrong input params',
        input: {
          data: null,
          snsTopic: null
        } as any,
        expectedCallInput: {
          Message: JSON.stringify(null),
          TopicArn: null
        }
      }
    ])('$description', async ({ input, expectedCallInput }) => {
      const customSnsHandler = new CustomSnsHandler(mockedRegion)
      await customSnsHandler.publishMessageToSNS(input.data, input.snsTopic)

      expect(customSnsHandler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })
  })
})
