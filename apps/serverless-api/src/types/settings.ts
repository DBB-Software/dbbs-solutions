export interface ISettings extends Record<string, string> {}

export interface ISettingsResponse {
  settings: ISettings
}
