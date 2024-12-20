import { useMemo, useContext } from 'react'
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import { parseJSONWithFallback } from '@dbbs/mobile-common'

import { RemoteConfigContext } from './remote-config'
import { AnyFeatureValue, InitialRemoteConfigValues, RemoteConfigValues } from './types'

const parseConfigValue = (
  valueType: string,
  value: FirebaseRemoteConfigTypes.ConfigValue
): AnyFeatureValue | undefined => {
  switch (valueType) {
    case 'boolean':
      return value.asBoolean?.()
    case 'string':
      return value.asString?.()
    case 'number':
      return value.asNumber?.()
    case 'object':
      // @ts-expect-error: firebase is not provide way to parse json value via ConfigValue interface
      return parseJSONWithFallback(value._value, {})
    default:
      return undefined
  }
}

export const useRemoteConfig = <T>() => {
  const { initialValues, remoteConfigValues } = useContext(RemoteConfigContext)

  return useMemo(
    () =>
      Object.entries(remoteConfigValues).reduce<Partial<RemoteConfigValues>>((acc, [key, value]) => {
        if (value) {
          const defaultConfigValue = initialValues[key as keyof InitialRemoteConfigValues]
          const valueType = typeof defaultConfigValue
          const parsedValue = parseConfigValue(valueType, value)
          acc[key] = {
            value: parsedValue ?? defaultConfigValue,
            source: value.getSource?.() ?? 'default'
          }
        }

        return acc
      }, {}) as T,
    [initialValues, remoteConfigValues]
  )
}
