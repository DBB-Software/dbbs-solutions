import '@testing-library/react-native/extend-expect'

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    onMessage: jest.fn()
  })
}))

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
