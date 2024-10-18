import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react'

import remoteConfig, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import { initialRemoteConfigValues } from './remote-config-values'

interface IFlagProviderProps {
  children: ReactNode
}

export const RemoteConfigContext = createContext<FirebaseRemoteConfigTypes.ConfigValues>({})

export const RemoteConfigProvider = ({ children }: IFlagProviderProps) => {
  const [remoteConfigValues, setRemoteConfigValues] = useState<FirebaseRemoteConfigTypes.ConfigValues>({})

  const fetchAndActivate = useCallback(async () => {
    try {
      /**
       * Firebase nominally it does not support work with object,
       * because ConfigValue has no possibility to handle this type,
       * but actually json object comes as a string that can be parsed.
       */
      await remoteConfig().setDefaults(initialRemoteConfigValues as FirebaseRemoteConfigTypes.ConfigDefaults)
      await remoteConfig().fetch(0)
      await remoteConfig().fetchAndActivate()
      const fetchedValues = remoteConfig().getAll()
      setRemoteConfigValues({ ...remoteConfigValues, ...fetchedValues })
    } catch (error) {
      console.error('Error fetching or activating remote config:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchAndActivate()
  }, [fetchAndActivate])

  return <RemoteConfigContext.Provider value={remoteConfigValues}>{children}</RemoteConfigContext.Provider>
}
