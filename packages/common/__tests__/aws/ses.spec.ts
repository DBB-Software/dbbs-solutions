import { SESClient } from '@aws-sdk/client-ses'
import AWSXRayCore from 'aws-xray-sdk-core'
import { CustomSesHandler } from '../../src/aws/ses.js'
import { ISendEmailInput } from '../../src/aws/types/ses'
import { ValidationError } from '../../src'

jest.mock('@aws-sdk/client-ses', () => ({
  ...jest.requireActual('@aws-sdk/client-ses'),
  SESClient: jest.fn().mockImplementation(() => {
    return { send: jest.fn() }
  })
}))

jest.mock('aws-xray-sdk-core', () => ({
  captureAWSv3Client: jest.fn()
}))

describe('CustomSesHandler', () => {
  const mockedRegion: string = 'eu-central-1'
  const mockedData: ISendEmailInput = {
    recipientsEmails: ['recipient@gmail.com'],
    senderEmail: 'sender@gmail.com',
    message: { Subject: { Charset: '', Data: '' }, Body: {} }
  }

  afterEach(jest.clearAllMocks)

  describe('constructor (SNS Client Initialize)', () => {
    test.each([
      {
        description: 'should initialize SES client instance with X-Ray',
        region: mockedRegion,
        enableXRay: true,
        expectedCalls: 1,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      },
      {
        description: 'should initialize SES client instance without X-Ray',
        region: mockedRegion,
        enableXRay: false,
        expectedCalls: 0,
        expectedCallInput: { region: mockedRegion, apiVersion: 'latest' }
      }
    ])('$description', async ({ enableXRay, expectedCalls, expectedCallInput }) => {
      new CustomSesHandler(mockedRegion, enableXRay)

      expect(AWSXRayCore.captureAWSv3Client).toBeCalledTimes(expectedCalls)
      expect(SESClient).toHaveBeenCalledWith(expectedCallInput)
    })
  })

  describe('sendEmail', () => {
    it('should send email with correct input params', async () => {
      const input = {
        data: mockedData
      }

      const expectedCallInput = {
        Source: mockedData.senderEmail,
        Destination: {
          ToAddresses: mockedData.recipientsEmails
        },
        Message: mockedData.message
      }

      const customSnsHandler = new CustomSesHandler(mockedRegion)
      await customSnsHandler.sendEmail(input.data)

      expect(customSnsHandler.client.send).toHaveBeenCalledWith(expect.objectContaining({ input: expectedCallInput }))
    })

    it('should throw error with wrong input params', async () => {
      const expectedError = new ValidationError('Invalid input data')

      const customSesHandler = new CustomSesHandler(mockedRegion)

      await expect(customSesHandler.sendEmail(undefined as any)).rejects.toThrow(expectedError)
    })
  })
})
