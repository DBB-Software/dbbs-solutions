export interface ISettings {}

export interface ISettingsResponse extends ISettings {}

export interface ISettingsServiceOptions {
  region: string
  endpoint: string
  serviceName: string
  enableXRay?: boolean
}

export interface ISettingsModuleOptions extends ISettingsServiceOptions {}
