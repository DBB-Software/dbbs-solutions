import { useMemo, useContext } from 'react'
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'

import { RemoteConfigContext } from './remote-config'
import { FirebaseRemoteConfigValues, RemoteConfigValues, initialRemoteConfigValues } from './remote-config-values'
import { parseJSONWithFallback } from '../../utils'

const parseConfigValue = (
  valueType: string,
  value: FirebaseRemoteConfigTypes.ConfigValue
): boolean | string | number | undefined => {
  switch (valueType) {
    case 'boolean':
      return value.asBoolean?.()
    case 'string':
      return value.asString?.()
    case 'number':
      return value.asNumber?.()
    case 'object':
      // @ts-expect-error: firebase is not provide way to parse json value via ConfigValue interface
      return parseJSONWithFallback(value._value)
    default:
      return undefined
  }
}

export const useRemoteConfig = () => {
  const context = useContext(RemoteConfigContext)

  return useMemo(
    () =>
      Object.entries(context).reduce<Partial<RemoteConfigValues>>((acc, [key, value]) => {
        if (value) {
          const defaultConfigValue = initialRemoteConfigValues[key as keyof FirebaseRemoteConfigValues]
          const valueType = typeof defaultConfigValue
          const parsedValue = parseConfigValue(valueType, value)
          // @ts-expect-error: in this place will be a specific type: string, number, boolean or object
          acc[key] = {
            value: parsedValue ?? defaultConfigValue,
            source: value.getSource?.() ?? 'default'
          }
        }

        return acc
      }, {}),
    [context]
  )
}
