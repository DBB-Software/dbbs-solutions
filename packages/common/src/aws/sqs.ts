import { SQSClient, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomSqsHandler {
  client: SQSClient

  queueUrl?: string

  constructor(region: string, enableXRay: boolean = false, queueUrl?: string) {
    const client = new SQSClient({
      region,
      apiVersion: 'latest'
    })

    this.queueUrl = queueUrl
    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  async sendToSQS(data: object, queueUrl?: string): Promise<SendMessageCommandOutput> {
    const commandInput: SendMessageCommandInput = {
      MessageBody: JSON.stringify(data),
      QueueUrl: queueUrl || this.queueUrl
    }
    const command = new SendMessageCommand(commandInput)

    return this.client.send(command)
  }
}
