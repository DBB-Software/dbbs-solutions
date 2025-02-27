import MailService from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response.js'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SendEmailInput } from './types/index.js'
import { validateSendEmailPayload } from './validation/index.js'

/**
 * Service for sending emails using SendGrid.
 * This service interacts with the SendGrid API to send emails with various configurations.
 * It requires a SendGrid API key to be set in the application configuration and an authorized sender email address.
 *
 * The service also validates the email fields before sending, ensuring that at least one of the body fields (text or html) is present,
 * and that the provided email addresses are valid.
 *
 * @class SendgridService
 */
@Injectable()
export class SendgridService {
  /**
   * Authorized email in Sendgrid
   * @private
   */
  private readonly senderEmail: string

  /**
   * Creates an instance of the SendgridService.
   * Initializes the SendGrid API with the provided API key from the configuration.
   *
   * @constructor
   * @param {ConfigService} configService - The service used to retrieve configuration values such as the SendGrid API key and authorized sender email.
   * @throws {Error} If the SendGrid API key is not specified in the configuration.
   */
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY')
    this.senderEmail = `${configService.get<string>('SENDGRID_AUTHORIZE_EMAIL')}`

    if (!apiKey) {
      throw new Error('Sendgrid apiKey value not specified')
    }

    MailService.setApiKey(apiKey)
  }

  /**
   * Sends an email using the SendGrid service.
   * This method takes the input email data, validates it, and sends the email via the SendGrid API.
   * It ensures the provided email addresses are valid and that at least one of the email body fields (text or html) is provided.
   *
   * @param {SendEmailInput} input - The email input data, including subject, recipient(s), and content (either text or html).
   * @throws {ValidationError} If the provided email input fails validation, such as missing required fields or invalid email format.
   * @returns {Promise<[ClientResponse, object]>} The response from the SendGrid API after sending the email.
   */
  sendEmail(input: SendEmailInput): Promise<[ClientResponse, object]> {
    validateSendEmailPayload(input)
    return MailService.send({ from: this.senderEmail, ...input })
  }
}
