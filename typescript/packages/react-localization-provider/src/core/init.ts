import i18n, { InitOptions, Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

interface LocaleServiceProps extends InitOptions {
  resources: Resource
  defaultLanguage?: string
}

export const initLocaleService = ({ defaultLanguage = 'en', resources, ...restProps }: LocaleServiceProps) => {
  i18n.use(initReactI18next).init({
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    compatibilityJSON: 'v3',
    resources: {
      ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            translation: value
          }
        }),
        {}
      ),
      LANGUAGES: resources
    },
    ...restProps
  })
}
