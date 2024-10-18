import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import AWSXRayCore from 'aws-xray-sdk-core'

/**
 * This class provides methods to interact with AWS DynamoDB.
 * It supports optional integration with AWS X-Ray for enhanced monitoring and tracing capabilities.
 */
export class CustomDynamoDBHandler {
  client: DynamoDBClient

  /**
   * Initializes a new instance of the DynamoDB handler with specified region and optional X-Ray tracing.
   * @param region The AWS region where the DynamoDB instance is hosted.
   * @param enableXRay Optional flag to enable tracing with AWS X-Ray.
   */
  constructor(region: string, enableXRay: boolean = false) {
    const client = new DynamoDBClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }
}
