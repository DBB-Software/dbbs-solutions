import '@testing-library/react-native/pure'

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn()
  }))
}))

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn()
}))

jest.mock('@dbbs/react-localization-provider', () => ({
  initLocaleService: jest.fn()
}))

jest.mock('react-native-iap')
jest.mock('@sentry/react-native')
