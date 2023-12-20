export interface ISettingServiceClient {
  getAllTenantSettings(): Promise<object>
  getTenantSettings(tenantId: string): Promise<object>
}
