import { MailDataRequired } from '@sendgrid/mail'

export interface ISendEmailInput {
  recipientEmail: string

  senderEmail: string

  subject: string

  message: MailDataRequired['html']

  text: string
}
