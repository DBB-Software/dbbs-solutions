import '@testing-library/react-native/extend-expect'

import fetchMock from 'jest-fetch-mock'

beforeAll(() => {
  jest.clearAllMocks()
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

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn().mockResolvedValue('MOCK_FCM_TOKEN'),
    onMessage: jest.fn().mockImplementation((callback) => {
      // Simulate receiving a message
      callback({ data: { message: 'Mock push notification' } })
      return jest.fn() // return an unsubscribe function
    }),
    onTokenRefresh: jest.fn().mockImplementation((callback) => {
      callback('MOCK_NEW_FCM_TOKEN')
      return jest.fn() // return an unsubscribe function
    }),
    isDeviceRegisteredForRemoteMessages: true,
    registerDeviceForRemoteMessages: jest.fn(),
    unregisterDeviceForRemoteMessages: jest.fn(),
    setBackgroundMessageHandler: jest.fn()
  })
}))

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    displayNotification: jest.fn().mockResolvedValue(null),
    requestPermission: jest.fn().mockResolvedValue(true),
    onBackgroundEvent: jest.fn(),
    cancelAllNotifications: jest.fn(),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    onForegroundEvent: jest.fn()
  }
}))

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(),
  isVisible: jest.fn().mockResolvedValue(false),
  useHideAnimation: jest.fn().mockReturnValue({
    container: {},
    logo: { source: 0 },
    brand: { source: 0 }
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
