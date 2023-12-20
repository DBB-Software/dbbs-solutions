import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomDynamoDBHandler {
  client: DynamoDBClient

  constructor(region: string, enableXRay: boolean = false) {
    const client = new DynamoDBClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }
}
