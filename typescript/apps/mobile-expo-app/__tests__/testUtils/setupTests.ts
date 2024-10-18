import '@testing-library/react-native/extend-expect'

import fetchMock from 'jest-fetch-mock'

beforeAll(() => {
  fetchMock.enableMocks()
})

afterAll(() => {
  fetchMock.disableMocks()
})

jest.mock('@react-native-firebase/remote-config', () => ({
  __esModule: true,
  default: () => ({
    setDefaults: jest.fn().mockResolvedValue(null),
    fetch: jest.fn().mockResolvedValue(null),
    fetchAndActivate: jest.fn().mockResolvedValue(null),
    getAll: jest.fn().mockReturnValue({
      test: {
        _value: 'TEST_REMOTE',
        _source: 'remote',
        asString: () => 'TEST_REMOTE',
        getSource: () => 'remote'
      }
    })
  })
}))

jest.mock('@sentry/react-native', () => ({
  __esModule: true,
  init: jest.fn()
}))

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'en' }])
}))

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn()
  }))
}))

jest.mock('@dbbs/react-localization-provider', () => ({
  initLocaleService: jest.fn(),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {})
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}))
