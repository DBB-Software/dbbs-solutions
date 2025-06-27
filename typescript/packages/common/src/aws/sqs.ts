import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput
} from '@aws-sdk/client-sqs'
import AWSXRayCore from 'aws-xray-sdk-core'

/**
 * Provides a mechanism for managing Amazon SQS queues, including sending messages.
 * This class supports integration with AWS X-Ray for tracing message delivery to queues.
 */
export class CustomSqsHandler {
  client: SQSClient

  queueUrl?: string

  /**
   * Sets up an SQS client for interacting with Amazon SQS, specifying the region and optionally enabling AWS X-Ray tracing.
   * @constructor
   * @param {string} region The AWS region where the SQS is located.
   * @param {boolean} [enableXRay=false] Indicates whether to enable AWS X-Ray tracing.
   * @param {string} [queueUrl] Optionally specify the default queue URL for message sending.
   */
  constructor(region: string, enableXRay: boolean = false, queueUrl?: string) {
    const client = new SQSClient({
      region,
      apiVersion: 'latest'
    })

    this.queueUrl = queueUrl
    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Sends a message to an SQS queue. If the queue URL is not specified, it uses the default queue URL set during initialization.
   * @async
   * @param {object} data The message data to send.
   * @param {string} [queueUrl] The URL of the SQS queue to which the message should be sent.
   * @returns {Promise<SendMessageCommandOutput>} A promise that resolves to the result of the send operation.
   */
  async sendToSQS(data: object, queueUrl?: string): Promise<SendMessageCommandOutput> {
    const commandInput: SendMessageCommandInput = {
      MessageBody: JSON.stringify(data),
      QueueUrl: queueUrl ?? this.queueUrl
    }
    const command = new SendMessageCommand(commandInput)

    return this.client.send(command)
  }

  /**
   * Sends a batch of messages to an SQS queue. If the queue URL is not specified, it uses the default queue URL set during initialization.
   * @async
   * @param {Array<object>} messages The message data to send.
   * @param {string} [queueUrl] The URL of the SQS queue to which the message should be sent.
   * @returns {Promise<SendMessageCommandOutput>} A promise that resolves to the result of the send operation.
   */
  async sendBatchToSQS(messages: object[], queueUrl?: string): Promise<SendMessageBatchCommandOutput> {
    const entries = messages.map((msg, index) => ({
      Id: index.toString(),
      MessageBody: JSON.stringify(msg)
    }))
    const commandInput: SendMessageBatchCommandInput = {
      Entries: entries,
      QueueUrl: queueUrl ?? this.queueUrl
    }
    const command = new SendMessageBatchCommand(commandInput)
    return this.client.send(command)
  }
}
