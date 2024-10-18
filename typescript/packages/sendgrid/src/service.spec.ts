import { SendgridService } from './service.js'
import * as SendGrid from '@sendgrid/mail'
import { ISendEmailInput } from './interfaces.js'
import { ValidationError } from '@dbbs/common'

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn().mockImplementation(() => {}),
  send: jest.fn()
}))

describe('SendgridService', () => {
  const mockedApiKey: string = 'testapikey'
  const mockedData: ISendEmailInput = {
    recipientEmail: 'recipient@gmail.com',
    senderEmail: 'sender@gmail.com',
    message: 'Test Messaage',
    text: 'Test Text',
    subject: 'Test Subject'
  }

  afterEach(jest.clearAllMocks)

  describe('sendEmail', () => {
    it('should send email with correct input params', async () => {
      const input = mockedData

      const expectedCallInput = {
        subject: input.subject,
        text: input.text,
        to: input.recipientEmail,
        from: input.senderEmail,
        html: input.message
      }

      const sendgridService = new SendgridService(mockedApiKey)
      await sendgridService.sendEmail(input)

      expect(SendGrid.default.send).toHaveBeenCalledWith(expect.objectContaining(expectedCallInput))
    })

    test.each([
      {
        description: 'should throw recipientEmail validation exception',
        input: { ...mockedData, recipientEmail: '' },
        expectedErrorMessage: 'recipientEmail value not specified'
      },
      {
        description: 'should throw senderEmail validation exception',
        input: { ...mockedData, senderEmail: '' },
        expectedErrorMessage: 'senderEmail value not specified'
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
      },
      {
        description: 'should throw text validation exception',
        input: { ...mockedData, text: '' },
        expectedErrorMessage: 'text value not specified'
      }
    ])('$description', async ({ input, expectedErrorMessage }) => {
      const expectedError = new ValidationError(expectedErrorMessage)

      const sendgridService = new SendgridService(mockedApiKey)

      await expect(sendgridService.sendEmail(input)).rejects.toThrow(expectedError)
    })
  })
})
