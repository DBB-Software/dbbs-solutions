import { getLocales } from 'react-native-localize'
import { initLocaleService } from '@dbbs/react-localization-provider'
import { detectAppLanguage, localeStorage } from '../../src'

const defaultResources = {
  en: { common: { language: 'English' } },
  de: { common: { language: 'Deutsch' } }
}

describe('detectAppLanguage', () => {
  const testCases = [
    {
      description: 'should initialize locale service with system language when no stored language is found',
      systemLanguage: 'en',
      storedLanguage: null,
      storageKey: 'locale-code',
      expectedLanguage: 'en'
    },
    {
      description: 'should initialize locale service with stored language when it exists',
      systemLanguage: 'en',
      storedLanguage: 'de',
      storageKey: 'locale-code',
      expectedLanguage: 'de'
    },
    {
      description: 'should use custom storageKey if provided and initialize with system language',
      systemLanguage: 'en',
      storedLanguage: null,
      storageKey: 'custom-locale-code',
      expectedLanguage: 'en'
    },
    {
      description: 'should use custom storageKey if provided and initialize with stored language',
      systemLanguage: 'en',
      storedLanguage: 'de',
      storageKey: 'custom-locale-code',
      expectedLanguage: 'de'
    }
  ]

  test.each(testCases)('$description', ({ systemLanguage, storedLanguage, storageKey, expectedLanguage }) => {
    const mockGetLocales = getLocales as jest.Mock
    const mockGetString = localeStorage.getString as jest.Mock

    mockGetLocales.mockReturnValue([{ languageCode: systemLanguage }])
    mockGetString.mockReturnValue(storedLanguage)

    detectAppLanguage(defaultResources, storageKey)

    expect(localeStorage.getString).toHaveBeenCalledWith(storageKey)
    expect(initLocaleService).toHaveBeenCalledWith({ resources: defaultResources, defaultLanguage: expectedLanguage })
  })
})
