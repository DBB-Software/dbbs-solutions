import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput
} from '@aws-sdk/client-secrets-manager'
import AWSXRayCore from 'aws-xray-sdk-core'

export class CustomSecretManagerHandler {
  client: SecretsManagerClient

  constructor(region: string, enableXRay: boolean = false) {
    const client = new SecretsManagerClient({
      region
    })

    this.client = enableXRay ? AWSXRayCore.captureAWSv3Client(client) : client
  }

  /**
   * Get secret value by secretName parameter.
   * @async
   * @param {string} [secretName] The name of secret to get values from.
   * @returns {Promise<GetSecretValueCommandOutput>} A promise that resolves to the result of the send operation.
   */
  async getSecretValue(secretName: string): Promise<GetSecretValueCommandOutput> {
    const commandInput: GetSecretValueCommandInput = { SecretId: secretName }
    const command = new GetSecretValueCommand(commandInput)

    return this.client.send(command)
  }
}
