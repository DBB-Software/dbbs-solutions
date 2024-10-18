export enum RemoteConfigDefaultNames {
  test = 'test',
  testBoolean = 'testBoolean',
  testNumber = 'testNumber',
  testObject = 'testObject'
}

export interface FeatureType<T> {
  value: T
  source: string
}

export type RemoteConfigValues = {
  [RemoteConfigDefaultNames.test]: FeatureType<string>
  [RemoteConfigDefaultNames.testBoolean]: FeatureType<boolean>
  [RemoteConfigDefaultNames.testNumber]: FeatureType<number>
  [RemoteConfigDefaultNames.testObject]: FeatureType<{ test: string }>
}

export type FirebaseConfigValue = string | number | boolean | object

export type FirebaseRemoteConfigValues = {
  [key in RemoteConfigDefaultNames]: FirebaseConfigValue
}

export const initialRemoteConfigValues: FirebaseRemoteConfigValues = {
  [RemoteConfigDefaultNames.test]: 'TEST',
  [RemoteConfigDefaultNames.testBoolean]: true,
  [RemoteConfigDefaultNames.testNumber]: 1,
  [RemoteConfigDefaultNames.testObject]: { test: 'test' }
}
