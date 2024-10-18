import { render } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import { Text } from 'react-native'
import * as Auth0 from 'react-native-auth0'
import { AuthGuard, AuthGuardProps } from '../../../src'

const loaderTestId = 'loader'
const MockedLoader = () => <Text testID={loaderTestId}>Loading...</Text>
const childrenTestId = 'main'
const MockedChildren = () => <Text testID={childrenTestId}>Main</Text>
const fallbackTestId = 'fallback'
const MockedFallback = () => <Text testID={fallbackTestId}>Login</Text>

const mockedProps: AuthGuardProps = {
  clientId: 'mocked-client',
  domain: 'example.com',
  loadingComponent: <MockedLoader />,
  fallback: <MockedFallback />,
  children: <MockedChildren />
}

const useAuth0ReturnValue: ReturnType<typeof Auth0.useAuth0> = {
  user: null,
  isLoading: false,
  authorize: jest.fn(),
  sendSMSCode: jest.fn(),
  authorizeWithSMS: jest.fn(),
  sendEmailCode: jest.fn(),
  authorizeWithEmail: jest.fn(),
  sendMultifactorChallenge: jest.fn(),
  authorizeWithOOB: jest.fn(),
  authorizeWithOTP: jest.fn(),
  authorizeWithRecoveryCode: jest.fn(),
  hasValidCredentials: jest.fn(),
  clearSession: jest.fn(),
  getCredentials: jest.fn(),
  error: null,
  clearCredentials: jest.fn(),
  requireLocalAuthentication: jest.fn()
}

const useAuth0Spy = jest.spyOn(Auth0, 'useAuth0')

const renderAuthGuard = (overrideProps?: AuthGuardProps) =>
  render(<AuthGuard {...{ ...mockedProps, ...overrideProps }} />)

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuth0Spy.mockReturnValue(useAuth0ReturnValue)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render a fallback component before authorization', () => {
    const { getByTestId } = renderAuthGuard()
    const fallback = getByTestId(fallbackTestId)

    expect(fallback).toBeVisible()
  })

  it('should render custom loading component during getting session', () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      isLoading: true
    })
    const { getByTestId } = renderAuthGuard()
    const loader = getByTestId(loaderTestId)

    expect(loader).toBeVisible()
  })

  it('should render a main component after authorization', () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      user: {}
    })

    const { getByTestId } = renderAuthGuard()
    const main = getByTestId(childrenTestId)

    expect(main).toBeVisible()
  })
})
