import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
  PutEventsCommandOutput,
  PutEventsRequestEntry
} from '@aws-sdk/client-eventbridge'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomEventBridgeHandler {
  client: EventBridgeClient

  constructor(region: string, enableXRay: boolean = false) {
    const client = new EventBridgeClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  async publishToEventBridge(entries: Array<PutEventsRequestEntry>): Promise<PutEventsCommandOutput> {
    const input: PutEventsCommandInput = { Entries: entries }
    const putEventsCommand = new PutEventsCommand(input)

    return this.client.send(putEventsCommand)
  }
}
