import AWSXRayCore from 'aws-xray-sdk-core'
import { SESClient, SendEmailCommand, SendEmailCommandInput, SendEmailCommandOutput } from '@aws-sdk/client-ses'
import { ISendEmailInput } from './types/ses'
import { ValidationError } from '../error/validationError'

/**
 * Manages communication with the AWS Simple Email Service (SES),
 * enabling the sending of emails. It supports optional integration with AWS X-Ray for enhanced monitoring.
 */
export class CustomSesHandler {
  client: SESClient

  /**
   * Initializes the handler for AWS SES with region-specific configuration.
   * Optionally integrates with AWS X-Ray for tracing of the email sending operations.
   * @constructor
   * @param {string} region The AWS region where the SES service is located.
   * @param {boolean} [enableXRay=false] Indicates whether AWS X-Ray tracing should be enabled.
   */
  constructor(region: string, enableXRay: boolean = false) {
    const client = new SESClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Sends an email using AWS SES.
   * @async
   * @param {ISendEmailInput} data The data to be sent as the email content.
   * @returns {Promise<SendEmailCommandOutput>} A promise that resolves to the response from the SES service.
   * @throws {Error} Throws an error if the input data is invalid.
   */
  async sendEmail(data: ISendEmailInput): Promise<SendEmailCommandOutput> {
    if (!data || !data.senderEmail || !data.recipientsEmails || !data.message) {
      throw new ValidationError('Invalid input data')
    }

    const commandInput: SendEmailCommandInput = {
      Source: data.senderEmail,
      Destination: {
        ToAddresses: data.recipientsEmails
      },
      Message: data.message
    }

    const command = new SendEmailCommand(commandInput)

    return this.client.send(command)
  }
}
