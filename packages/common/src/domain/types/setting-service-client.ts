/**
 * Defines the contract for a service client to retrieve configuration settings specific to tenants.
 * This interface provides methods to access settings globally or for a specific tenant.
 */
export interface ISettingServiceClient {
  /**
   * Fetches all settings applicable across all tenants.
   * Useful for retrieving global configuration parameters.
   * @returns {Promise<object>} A promise that resolves to an object containing all tenant settings.
   */
  getAllTenantSettings(): Promise<object>

  /**
   * Fetches settings for a specific tenant, allowing for tenant-specific configurations.
   * @param {string} tenantId The unique identifier for the tenant whose settings are being requested.
   * @returns {Promise<object>} A promise that resolves to an object containing settings for the specified tenant.
   */
  getTenantSettings(tenantId: string): Promise<object>
}

/**
 * Interface representing the options required to initialize the SettingServiceClient.
 * It includes AWS Lambda function configurations such as region, endpoint, and settings function name.
 * Optionally, it allows enabling AWS X-Ray for tracing Lambda invocations.
 */
export interface ISettingServiceClientOptions {
  /**
   * The AWS region where the Lambda function is deployed.
   */
  region: string

  /**
   * The endpoint URL for the Settings Lambda Function.
   */
  endpoint: string

  /**
   * The name of the Lambda function that returns tenant settings.
   */
  settingsFunctionName: string

  /**
   * Optional flag to enable AWS X-Ray tracing for the Lambda client.
   */
  enableXRay?: boolean
}
