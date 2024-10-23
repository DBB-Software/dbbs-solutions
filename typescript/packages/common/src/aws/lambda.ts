import { LambdaClient } from '@aws-sdk/client-lambda'
import AWSXRayCore from 'aws-xray-sdk-core'

/**
 * Manages interactions with AWS Lambda functions, including invoking functions.
 * This handler supports AWS X-Ray integration for tracing Lambda invocations.
 */
export class CustomLambdaHandler {
  client: LambdaClient

  /**
   * Initializes the Lambda handler with specified region settings and optional X-Ray integration.
   * @param region The AWS region where the Lambda functions are hosted.
   * @param enableXRay Optional flag to enable AWS X-Ray for tracing.
   */
  constructor(region: string, enableXRay: boolean = false) {
    const client = new LambdaClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }
}
