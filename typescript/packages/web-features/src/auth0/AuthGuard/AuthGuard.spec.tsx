import { render, screen, waitFor } from '@testing-library/react'
import * as Auth0 from '@auth0/auth0-react'
import AuthGuard, { AuthGuardProps } from './AuthGuard'

const loaderTestId = 'mock-loader'
const MockedLoader = () => <p data-testid={loaderTestId}>Loading...</p>
const mockComponentTestId = 'mock-component'
const MockedChildrenContent = () => <p data-testid={mockComponentTestId}>My App</p>

const mockedProps: AuthGuardProps = {
  clientId: 'mocked-client',
  domain: 'example.com',
  children: <MockedChildrenContent />,
  loadingComponent: <MockedLoader />
}

const mockedToken = 'auth-token'

const useAuth0ReturnValue: ReturnType<typeof Auth0.useAuth0> = {
  isAuthenticated: false,
  isLoading: true,
  getIdTokenClaims: jest.fn(() => Promise.resolve({ __raw: mockedToken })),
  getAccessTokenSilently: jest.fn(() => Promise.resolve(mockedToken)) as never, // casting new value due to fn overload
  getAccessTokenWithPopup: jest.fn(),
  loginWithRedirect: jest.fn(),
  loginWithPopup: jest.fn(),
  logout: jest.fn(),
  handleRedirectCallback: jest.fn()
}

jest.mock('@auth0/auth0-react', () => {
  const actual = jest.requireActual('@auth0/auth0-react')

  return {
    ...actual,
    useAuth0: jest.fn(),
    Auth0Provider: ({ children }: AuthGuardProps) => children
  }
})

const useAuth0Spy = jest.spyOn(Auth0, 'useAuth0')

const renderAuthGuard = (overrideProps?: AuthGuardProps) =>
  render(<AuthGuard {...{ ...mockedProps, ...overrideProps }} />)

describe('<AuthGuard />', () => {
  beforeEach(() => {
    useAuth0Spy.mockReturnValue(useAuth0ReturnValue)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render custom loading component during getting session', () => {
    renderAuthGuard()
    const loaderText = screen.getByTestId(loaderTestId)

    expect(loaderText).toBeVisible()
  })

  it('should render children when authentication passed', () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      isLoading: false,
      isAuthenticated: true
    })

    renderAuthGuard({ ...mockedProps, loadingComponent: <MockedLoader /> })

    const appComponent = screen.getByTestId(mockComponentTestId)

    expect(appComponent).toBeVisible()
  })

  it('should call onAuthorized callback and set id token', async () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      isLoading: false,
      isAuthenticated: true
    })
    const onAuthorized = jest.fn()
    renderAuthGuard({ ...mockedProps, onAuthorized })

    await waitFor(() => {
      expect(onAuthorized).toHaveBeenCalledWith({ __raw: mockedToken })
    })
  })

  it('should call onAuthorized callback and set access token', async () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      isLoading: false,
      isAuthenticated: true
    })
    const onAuthorized = jest.fn()
    renderAuthGuard({ ...mockedProps, onAuthorized, useAccessToken: true })

    await waitFor(() => {
      expect(onAuthorized).toHaveBeenCalledWith(mockedToken)
    })
  })

  it('should call loginWithRedirect', async () => {
    useAuth0Spy.mockReturnValue({
      ...useAuth0ReturnValue,
      isLoading: false
    })
    const redirectOptions: Auth0.RedirectLoginOptions<Auth0.AppState> = {
      openUrl: jest.fn()
    }
    renderAuthGuard({ ...mockedProps, redirectOptions })

    await waitFor(() => {
      expect(useAuth0ReturnValue.loginWithRedirect).toHaveBeenCalledWith(redirectOptions)
    })
  })
})
