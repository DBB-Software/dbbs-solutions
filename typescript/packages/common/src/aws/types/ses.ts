import { SendEmailCommandInput } from '@aws-sdk/client-ses'

export interface ISendEmailInput {
  recipientsEmails: string[]

  senderEmail: string

  message: SendEmailCommandInput['Message']
}
