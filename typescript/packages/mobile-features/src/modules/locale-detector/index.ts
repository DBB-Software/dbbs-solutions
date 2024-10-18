import { MMKV } from 'react-native-mmkv'
import { getLocales } from 'react-native-localize'
import { initLocaleService, Resource } from '@dbbs/react-localization-provider'

export const localeStorage = new MMKV({ id: 'locale-storage' })

export const detectAppLanguage = (resources: Resource, storageKey = 'locale-code') => {
  // getLocales guaranteed to contain at least 1 element
  const systemLanguage = getLocales()[0].languageCode

  const storedLanguage = localeStorage.getString(storageKey)

  if (!storedLanguage) {
    initLocaleService({ resources, defaultLanguage: systemLanguage })
  } else {
    initLocaleService({ resources, defaultLanguage: storedLanguage })
  }
}
