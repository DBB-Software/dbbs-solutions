import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns'
import AWSXRayCore from 'aws-xray-sdk-core'

/**
 * Manages communication with the AWS Simple Notification Service (SNS),
 * enabling message publishing to SNS topics. It supports optional integration with AWS X-Ray for enhanced monitoring.
 */
export class CustomSnsHandler {
  client: SNSClient

  /**
   * Initializes the handler for AWS SNS with region-specific configuration.
   * Optionally integrates with AWS X-Ray for tracing of the message publishing operations.
   * @constructor
   * @param {string} region The AWS region where the SNS service is located.
   * @param {boolean} [enableXRay=false] Indicates whether AWS X-Ray tracing should be enabled.
   */
  constructor(region: string, enableXRay: boolean = false) {
    const client = new SNSClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Publishes a message to a specified SNS topic using provided message data.
   * @async
   * @param {object} data The data to be sent as the message content.
   * @param {string} snsTopic The ARN of the SNS topic to which the message will be published.
   * @returns {Promise<PublishCommandOutput>} A promise that resolves to the response from the SNS service.
   */
  async publishMessageToSNS(data: object, snsTopic: string): Promise<PublishCommandOutput> {
    const commandInput: PublishCommandInput = {
      Message: JSON.stringify(data),
      TopicArn: snsTopic
    }
    const command = new PublishCommand(commandInput)

    return this.client.send(command)
  }
}
