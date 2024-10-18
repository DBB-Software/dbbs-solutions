import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomDynamoDBHandler } from '../../src/aws/dynamodb.js'

jest.mock('@aws-sdk/client-dynamodb')

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomDynamoDBHandler', () => {
  const mockedRegion: string = 'eu-central-1'

  afterEach(jest.clearAllMocks)

  describe('constructor (DynamoDB Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize DynamoDB client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize DynamoDB client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomDynamoDBHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(DynamoDBClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })
})
