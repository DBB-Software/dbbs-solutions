import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import {
  AccountInfo,
  AuthenticationResult,
  InteractionStatus,
  IPublicClientApplication,
  Logger
} from '@azure/msal-browser'

import useAuth, { MicrosoftLoginRequest } from './useAuth'
import { renderHook, act } from '../testUtils/testUtils'

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn()
}))

const mockInstance: Partial<IPublicClientApplication> = {
  loginPopup: jest.fn(),
  loginRedirect: jest.fn(),
  logoutPopup: jest.fn(),
  logoutRedirect: jest.fn()
}

const testLoginRequest: MicrosoftLoginRequest = { scopes: ['User.Read'] }

const setup = () => renderHook(() => useAuth(testLoginRequest))

const mockedUseMsal = jest.mocked(useMsal)
const mockedUseIsAuthenticated = jest.mocked(useIsAuthenticated)

mockedUseMsal.mockReturnValue({
  instance: mockInstance as IPublicClientApplication,
  accounts: [],
  inProgress: InteractionStatus.None,
  logger: new Logger({})
})

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return isAuthenticated = false and account = undefined if user is not authorized', () => {
    mockedUseIsAuthenticated.mockReturnValue(false)
    const { result } = setup()

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.account).toBe(undefined)
  })

  it('should return isAuthenticated = true and first account if user is authorized', () => {
    const user: AccountInfo = {
      homeAccountId: 'test-homeaccountid',
      environment: 'test-environment',
      tenantId: 'test-tenant',
      localAccountId: 'test-localaccountid',
      username: 'testUser@example.com'
    }

    mockedUseIsAuthenticated.mockReturnValue(true)
    mockedUseMsal.mockReturnValue({
      instance: mockInstance as IPublicClientApplication,
      accounts: [user],
      inProgress: InteractionStatus.None,
      logger: new Logger({})
    })
    const { result } = setup()

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.account).toEqual(user)
  })

  it.each<{
    authMethod: 'signInPopup' | 'signOutPopup' | 'signInRedirect' | 'signOutRedirect'
    msalMethod: 'loginPopup' | 'logoutPopup' | 'loginRedirect' | 'logoutRedirect'
  }>([
    {
      authMethod: 'signInPopup',
      msalMethod: 'loginPopup'
    },
    {
      authMethod: 'signOutPopup',
      msalMethod: 'logoutPopup'
    },
    {
      authMethod: 'signInRedirect',
      msalMethod: 'loginRedirect'
    },
    {
      authMethod: 'signOutRedirect',
      msalMethod: 'logoutRedirect'
    }
  ])('$authMethod calls $msalMethod', async ({ authMethod, msalMethod }) => {
    const { result } = setup()

    await act(async () => {
      await result.current[authMethod]()
    })

    expect(mockInstance[msalMethod]).toHaveBeenCalledTimes(1)
  })

  it.each<{
    authMethod: 'signInPopup' | 'signOutPopup' | 'signInRedirect' | 'signOutRedirect'
    msalMethod: 'loginPopup' | 'logoutPopup' | 'loginRedirect' | 'logoutRedirect'
  }>([
    {
      authMethod: 'signInPopup',
      msalMethod: 'loginPopup'
    },
    {
      authMethod: 'signOutPopup',
      msalMethod: 'logoutPopup'
    },
    {
      authMethod: 'signInRedirect',
      msalMethod: 'loginRedirect'
    },
    {
      authMethod: 'signOutRedirect',
      msalMethod: 'logoutRedirect'
    }
  ])('$authMethod handles an error', async ({ authMethod, msalMethod }) => {
    const error = new Error('error')
    const method = mockInstance[msalMethod] as jest.Mock<Promise<AuthenticationResult>, [MicrosoftLoginRequest]>
    method.mockRejectedValueOnce(error)
    console.error = jest.fn()

    const { result } = setup()

    await act(async () => {
      await result.current[authMethod]()
    })

    expect(console.error).toHaveBeenCalledWith(error)
  })
})
