import { LambdaClient } from '@aws-sdk/client-lambda'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomLambdaHandler } from './../../src/aws/lambda.js'

jest.mock('@aws-sdk/client-lambda')

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomLambdaHandler', () => {
  const mockedRegion: string = 'eu-central-1'

  afterEach(jest.clearAllMocks)

  describe('constructor (Lambda Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize Lambda client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize Lambda client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomLambdaHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(LambdaClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })
})
