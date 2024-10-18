import '@testing-library/react-native/pure'
import { AuthGuardProps } from '../../src'

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

jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      getString: jest.fn()
    }))
  }
})

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn()
}))

jest.mock('@dbbs/react-localization-provider', () => ({
  initLocaleService: jest.fn()
}))

jest.mock('react-native-auth0', () => {
  return {
    useAuth0: jest.fn(),
    Auth0Provider: ({ children }: AuthGuardProps) => children
  }
})
