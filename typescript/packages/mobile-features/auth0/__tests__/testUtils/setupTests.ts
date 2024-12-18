import '@testing-library/react-native/pure'
import { AuthGuardProps } from '../../src'

jest.mock('react-native-auth0', () => ({
  useAuth0: jest.fn(),
  Auth0Provider: ({ children }: AuthGuardProps) => children
}))
