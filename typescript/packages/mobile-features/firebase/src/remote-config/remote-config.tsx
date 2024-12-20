import React, { createContext, useCallback, useEffect, useState } from 'react'

import remoteConfig, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import { RemoteConfigContextProps, RemoteConfigProviderProps } from './types'

export const RemoteConfigContext = createContext<RemoteConfigContextProps>({
  initialValues: {},
  remoteConfigValues: {}
})

export const RemoteConfigProvider = ({ initialValues, children }: RemoteConfigProviderProps) => {
  const [remoteConfigValues, setRemoteConfigValues] = useState<FirebaseRemoteConfigTypes.ConfigValues>({})

  const fetchAndActivate = useCallback(async () => {
    try {
      /**
       * Firebase nominally it does not support work with object,
       * because ConfigValue has no possibility to handle this type,
       * but actually json object comes as a string that can be parsed.
       */
      await remoteConfig().setDefaults(initialValues as FirebaseRemoteConfigTypes.ConfigDefaults)
      await remoteConfig().fetch(0)
      await remoteConfig().fetchAndActivate()
      const fetchedValues = remoteConfig().getAll()
      setRemoteConfigValues(fetchedValues)
    } catch (error) {
      console.error('Error fetching or activating remote config:', error)
    }
  }, [initialValues])

  useEffect(() => {
    fetchAndActivate()
  }, [fetchAndActivate])

  return (
    <RemoteConfigContext.Provider value={{ remoteConfigValues, initialValues }}>
      {children}
    </RemoteConfigContext.Provider>
  )
}
