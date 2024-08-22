import * as SendGrid from '@sendgrid/mail'

import { ValidationError } from '@dbbs/common'
import { ISendEmailInput } from './interfaces.js'

export class SendgridService {
  constructor(apiKey: string | undefined = process.env.SENGRID_API_KEY) {
    if (!apiKey) {
      console.warn('Sendgrid apiKey value not specified')
      return
    }

    SendGrid.default.setApiKey(apiKey)
  }

  async sendEmail(data: ISendEmailInput) {
    if (!data?.recipientEmail) {
      throw new ValidationError('recipientEmail value not specified')
    }
    if (!data?.senderEmail) {
      throw new ValidationError('senderEmail value not specified')
    }
    if (!data?.message) {
      throw new ValidationError('message value not specified')
    }
    if (!data?.subject) {
      throw new ValidationError('subject value not specified')
    }
    if (!data?.text) {
      throw new ValidationError('text value not specified')
    }

    return SendGrid.default.send({
      subject: data.subject,
      text: data.text,
      to: data.recipientEmail,
      from: data.senderEmail,
      html: data.message
    })
  }
}
