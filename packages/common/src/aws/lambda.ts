import { LambdaClient } from '@aws-sdk/client-lambda'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomLambdaHandler {
  client: LambdaClient

  constructor(region: string, enableXRay: boolean = false) {
    const client = new LambdaClient({
      region,
      apiVersion: 'latest'
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }
}
