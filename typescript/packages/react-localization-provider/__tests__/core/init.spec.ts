import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { initLocaleService } from '../../src'

const defaultResources = {
  en: { common: { language: 'English' } },
  de: { common: { language: 'Deutsch' } }
}

describe('init i18next', () => {
  const testCases = [
    {
      description: 'should initialize i18n with default language when no defaultLanguage is provided',
      defaultLanguage: undefined,
      resources: defaultResources,
      additionalOptions: {},
      expectedLng: 'en'
    },
    {
      description: 'should initialize i18n with provided default language',
      defaultLanguage: 'de',
      resources: defaultResources,
      additionalOptions: {},
      expectedLng: 'de'
    },
    {
      description: 'should merge additional init options',
      defaultLanguage: 'en',
      resources: defaultResources,
      additionalOptions: { debug: true },
      expectedLng: 'en',
      expectedDebug: true
    },
    {
      description: 'should correctly process resources and structure them for i18n',
      defaultLanguage: 'en',
      resources: defaultResources,
      additionalOptions: {},
      expectedLng: 'en'
    }
  ]

  test.each(testCases)(
    '$description',
    ({ defaultLanguage, resources, additionalOptions, expectedLng, expectedDebug }) => {
      initLocaleService({ defaultLanguage, resources, ...additionalOptions })

      expect(i18n.use).toHaveBeenCalledWith(initReactI18next)
      expect(i18n.init).toHaveBeenCalledWith({
        lng: expectedLng,
        fallbackLng: expectedLng,
        compatibilityJSON: 'v3',
        resources: {
          en: { translation: { common: { language: 'English' } } },
          de: { translation: { common: { language: 'Deutsch' } } },
          LANGUAGES: defaultResources
        },
        ...additionalOptions
      })

      if (expectedDebug !== undefined) {
        expect(i18n.init).toHaveBeenCalledWith(expect.objectContaining({ debug: expectedDebug }))
      }
    }
  )
})
