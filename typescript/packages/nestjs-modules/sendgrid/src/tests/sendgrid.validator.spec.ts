import { ValidationError } from '@dbbs/common'

import { validateSendEmailPayload } from '../validation/index.js'
import { SendEmailInput } from '../types/index.js'

describe('validateSendEmailPayload', () => {
  it('should throw an error if subject is missing', () => {
    const invalidInput: SendEmailInput = {
      subject: '',
      to: 'recipient@example.com',
      text: 'This is a test email'
    }

    const error = new ValidationError('Missing required fields: subject')
    expect(() => validateSendEmailPayload(invalidInput)).toThrow(error)
  })

  it('should throw an error if neither text nor html is provided', () => {
    const invalidInput: SendEmailInput = {
      subject: 'Test Subject',
      to: 'recipient@example.com',
    }

    const error = new ValidationError('Missing required fields: text or html must be provided')
    expect(() => validateSendEmailPayload(invalidInput)).toThrow(error)
  })

  it('should validate email addresses in `to` field', () => {
    const validInput: SendEmailInput = {
      subject: 'Test Subject',
      to: 'valid@example.com',
      text: 'Email content',
    }

    // No need to mock validateEmail, as it's already working correctly
    expect(() => validateSendEmailPayload(validInput)).not.toThrow()
  })

  it('should throw an error if email in `to` is invalid', () => {
    const invalidInput: SendEmailInput = {
      subject: 'Test Subject',
      to: 'invalid-email',
      text: 'Email content',
    }

    const invalidEmailError = new ValidationError('Invalid email format: invalid-email')
    expect(() => validateSendEmailPayload(invalidInput)).toThrow(invalidEmailError)
  })

  it('should validate email addresses in `cc` field if provided', () => {
    const validInput: SendEmailInput = {
      subject: 'Test Subject',
      to: 'recipient@example.com',
      cc: 'cc@example.com',
      text: 'Email content',
    }

    expect(() => validateSendEmailPayload(validInput)).not.toThrow()
  })

  it('should validate email addresses in `bcc` field if provided', () => {
    const validInput: SendEmailInput = {
      subject: 'Test Subject',
      to: 'recipient@example.com',
      bcc: 'bcc@example.com',
      text: 'Email content',
    }

    expect(() => validateSendEmailPayload(validInput)).not.toThrow()
  })

  it('should handle multiple emails in `to`, `cc`, and `bcc` fields', () => {
    const validInput: SendEmailInput = {
      subject: 'Test Subject',
      to: ['recipient1@example.com', 'recipient2@example.com'],
      cc: ['cc1@example.com', 'cc2@example.com'],
      bcc: ['bcc1@example.com', 'bcc2@example.com'],
      text: 'Email content',
    }

    expect(() => validateSendEmailPayload(validInput)).not.toThrow()
  })
})
