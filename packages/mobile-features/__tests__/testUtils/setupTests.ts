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
