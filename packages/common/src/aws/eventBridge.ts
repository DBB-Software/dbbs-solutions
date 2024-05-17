import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
  PutEventsCommandOutput,
  PutEventsRequestEntry
} from '@aws-sdk/client-eventbridge'
import AWSXRayCore from 'aws-xray-sdk-core'

/**
 * Handles interactions with AWS EventBridge, facilitating the publishing of events.
 * Can be configured with AWS X-Ray for operational insights through tracing.
 */
export class CustomEventBridgeHandler {
  client: EventBridgeClient

  /**
   * Constructs the EventBridge handler with the specified AWS region and optional X-Ray tracing.
   * @param region The AWS region to configure the EventBridge client.
   * @param enableXRay Optional flag to enable AWS X-Ray tracing.
   */
  constructor(region: string, enableXRay: boolean = false) {
    const client = new EventBridgeClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Publishes an array of event entries to AWS EventBridge.
   * @param entries An array of events to be sent to EventBridge.
   * @returns A promise resolving to the result of the event publication.
   */
  async publishToEventBridge(entries: Array<PutEventsRequestEntry>): Promise<PutEventsCommandOutput> {
    const input: PutEventsCommandInput = { Entries: entries }
    const putEventsCommand = new PutEventsCommand(input)

    return this.client.send(putEventsCommand)
  }
}
