import { describe, beforeEach, jest, test, expect } from '@jest/globals'
import { ICustomContext } from '@dbbs/common'

const MOCKED_ENV = {
  REGION: 'region',
  S3_DOCUMENTS_BUCKET: 'bucket',
  S3_DOCUMENTS_BUCKET_URL: 'bucket_url',
  SQS_QUEUE_URL: 'sqs_url',
  STAGE: 'stage'
}

const mockAxiosGetFn = jest.fn()
const mockAxiosPostFn = jest.fn(() => Promise.resolve({ data: {} })) // TODO replace data with real
const mockUploadFileStreamToS3 = jest.fn()
const mockSendToSqs = jest.fn()

jest.unstable_mockModule('axios', () => ({
  default: {
    get: mockAxiosGetFn,
    post: mockAxiosPostFn
  }
}))
jest.mock('@dbbs/common', () => {
  const actualModule: object = jest.requireActual('@dbbs/common')

  return {
    ...actualModule,
    loggerMiddleware: jest.fn().mockImplementation(() => ({
      before: jest.fn(),
      middleware: jest.fn()
    })),
    CustomS3Handler: jest.fn().mockImplementation(() => ({
      uploadFileStream: mockUploadFileStreamToS3
    })),
    CustomSqsHandler: jest.fn().mockImplementation(() => ({
      sendToSQS: mockSendToSqs
    }))
  }
})

const { handler } = await import('../src/documentsScraper.js')

describe('documentsScraper', () => {
  function clearEnvVariable(variable: string = '') {
    process.env[variable] = ''
  }

  describe('scrapeLatest', () => {
    const { REGION, S3_DOCUMENTS_BUCKET, S3_DOCUMENTS_BUCKET_URL, SQS_QUEUE_URL, STAGE } = MOCKED_ENV
    const input = { event: {}, context: { logger: console } }

    beforeEach(() => {
      process.env.REGION = REGION
      process.env.S3_DOCUMENTS_BUCKET = S3_DOCUMENTS_BUCKET
      process.env.S3_DOCUMENTS_BUCKET_URL = S3_DOCUMENTS_BUCKET_URL
      process.env.SQS_QUEUE_URL = SQS_QUEUE_URL
      process.env.STAGE = STAGE
    })

    test('Successful scrape and SQS send', async () => {
      // TODO setup mockAxiosGetFn, mockUploadFileStreamToS3 and mockSendToSqs mocks

      const { event, context } = input
      await expect(handler(event, context as unknown as ICustomContext)).resolves.not.toThrow()

      // TODO replace with actual values
      // expect(mockAxiosGetFn).toHaveBeenCalledTimes(1)
      // expect(mockUploadFileStreamToS3).toHaveBeenCalledTimes(1)
      // expect(mockSendToSqs).toHaveBeenCalledTimes(1)
    })

    test.each([
      // TODO add more test cases
      {
        description: 'should throw error when REGION is missing',
        envToClear: 'REGION',
        expectedErrorMessage: 'No REGION variable provided'
      }
    ])('$description', async ({ expectedErrorMessage, envToClear }) => {
      const { event, context } = input
      clearEnvVariable(envToClear)

      await expect(async () => await handler(event, context as unknown as ICustomContext)).rejects.toThrow(
        expectedErrorMessage
      )
    })
  })
})
