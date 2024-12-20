import { ReactNode } from 'react'
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'

export type AnyFeatureValue = string | number | boolean | object

export type InitialRemoteConfigValues = Record<string, AnyFeatureValue>

export interface RemoteConfigContextProps {
  initialValues: InitialRemoteConfigValues
  remoteConfigValues: FirebaseRemoteConfigTypes.ConfigValues
}

export interface RemoteConfigProviderProps {
  initialValues: InitialRemoteConfigValues
  children: ReactNode
}
export interface FeatureType<T> {
  value: T | undefined
  source: string
}

export type RemoteConfigValues = Record<string, FeatureType<unknown>>
