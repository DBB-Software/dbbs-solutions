import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomSnsHandler {
  client: SNSClient

  constructor(region: string, enableXRay: boolean = false) {
    const client = new SNSClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  async publishMessageToSNS(data: object, snsTopic: string): Promise<PublishCommandOutput> {
    const commandInput: PublishCommandInput = {
      Message: JSON.stringify(data),
      TopicArn: snsTopic
    }
    const command = new PublishCommand(commandInput)

    return this.client.send(command)
  }
}
