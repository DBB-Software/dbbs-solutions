import '@testing-library/react-native/pure'

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

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn()
}))
