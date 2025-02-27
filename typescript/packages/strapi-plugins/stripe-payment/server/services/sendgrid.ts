import * as SendGrid from '@sendgrid/mail'
import { ValidationError } from '@dbbs/common'

import { ISendEmailInput } from '../interfaces'

/**
 * Service for sending emails using SendGrid.
 * @class
 */
export class SendgridService {
  /**
   * Creates an instance of SendgridService.
   * @constructor
   * @param {string} [apiKey=process.env.SENGRID_API_KEY] - The SendGrid API key. If not provided, it will default to the value of the SENGRID_API_KEY environment variable.
   * @param verifiedEmail
   */
  constructor(
    private readonly apiKey: string,
    private readonly verifiedEmail: string
  ) {
    SendGrid.setApiKey(apiKey)
  }

  /**
   * Sends an email using SendGrid.
   * @async
   * @param {ISendEmailInput} data - The data required to send the email.
   * @param {string} data.recipientEmail - The recipient's email address.
   * @param {string} data.senderEmail - The sender's email address.
   * @param {string} data.subject - The subject of the email.
   * @param {string} data.message - The HTML message content of the email.
   * @param {string} data.text - The plain text content of the email.
   * @throws {ValidationError} If any required field (recipientEmail, senderEmail, message, subject, or text) is missing.
   */
  async sendEmail(data: ISendEmailInput) {
    if (!data?.recipientEmail) {
      throw new ValidationError('recipientEmail value not specified')
    }
    if (!data?.message) {
      throw new ValidationError('message value not specified')
    }
    if (!data?.subject) {
      throw new ValidationError('subject value not specified')
    }

    return SendGrid.send({
      subject: data.subject,
      to: data.recipientEmail,
      from: this.verifiedEmail,
      html: data.message
    })
  }
}
