import { SendgridService } from '../../server/services/sendgrid'
import * as SendGrid from '@sendgrid/mail'
import { ISendEmailInput } from '../../server/interfaces'
import { ValidationError } from '@dbbs/common'

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn().mockImplementation(() => {}),
  send: jest.fn()
}))

describe('SendgridService', () => {
  const mockedApiKey: string = 'testapikey'
  const mockVerifiedEmail = 'testmail.verified@mail.com'

  const mockedData: ISendEmailInput = {
    recipientEmail: 'recipient@gmail.com',
    message: 'Test Messaage',
    subject: 'Test Subject'
  }

  afterEach(jest.clearAllMocks)

  describe('sendEmail', () => {
    it('should send email with correct input params', async () => {
      const input = mockedData

      const expectedCallInput = {
        subject: input.subject,
        to: input.recipientEmail,
        html: input.message
      }

      const sendgridService = new SendgridService(mockedApiKey, mockVerifiedEmail)
      await sendgridService.sendEmail(input)

      expect(SendGrid.send).toHaveBeenCalledWith(expect.objectContaining(expectedCallInput))
    })

    test.each([
      {
        description: 'should throw recipientEmail validation exception',
        input: { ...mockedData, recipientEmail: '' },
        expectedErrorMessage: 'recipientEmail value not specified'
      },
      {
        description: 'should throw message validation exception',
        input: { ...mockedData, message: '' },
        expectedErrorMessage: 'message value not specified'
      },
      {
        description: 'should throw subject validation exception',
        input: { ...mockedData, subject: '' },
        expectedErrorMessage: 'subject value not specified'
      }
    ])('$description', async ({ input, expectedErrorMessage }) => {
      const expectedError = new ValidationError(expectedErrorMessage)

      const sendgridService = new SendgridService(mockedApiKey, mockVerifiedEmail)

      await expect(sendgridService.sendEmail(input)).rejects.toThrow(expectedError)
    })
  })
})
