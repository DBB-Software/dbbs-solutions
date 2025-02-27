import { ReactNode } from 'react'
import { Configuration } from '@azure/msal-browser'

import MicrosoftAuthProvider, { MicrosoftAuthProviderProps } from './MicrosoftAuthProvider'
import { MICROSOFT_AUTH_PROVIDER_DEFAULT_LOADER_TEST_ID } from './testids'
import { render, waitFor, screen } from '../testUtils/testUtils'

const TEST_IDS = {
  MSAL_PROVIDER: 'msal-provider',
  CHILDREN: 'children'
}

const mockInitialize = jest.fn().mockResolvedValue(undefined)
const mockGetAllAccounts = jest.fn().mockReturnValue([])
const mockSetActiveAccount = jest.fn()

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({
    initialize: mockInitialize,
    getAllAccounts: mockGetAllAccounts,
    setActiveAccount: mockSetActiveAccount
  }))
}))

jest.mock('@azure/msal-react', () => ({
  MsalProvider: jest.fn(({ children }: { children: ReactNode }) => (
    <div data-testid={TEST_IDS.MSAL_PROVIDER}>{children}</div>
  ))
}))

const testMsalConfig: Configuration = {
  auth: {
    clientId: 'test-client-id'
  }
}

const setup = ({ loader }: Partial<MicrosoftAuthProviderProps> = {}) =>
  render(
    <MicrosoftAuthProvider loader={loader} config={testMsalConfig}>
      <div data-testid={TEST_IDS.CHILDREN}>Child content</div>
    </MicrosoftAuthProvider>
  )

const checkProviderAndChildren = async () => {
  await waitFor(() => expect(screen.getByTestId(TEST_IDS.MSAL_PROVIDER)).toBeInTheDocument())
  const children = screen.getByTestId(TEST_IDS.CHILDREN)
  expect(children).toBeVisible()
}

describe('MicrosoftAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the loader before initialization is complete', () => {
    mockInitialize.mockResolvedValueOnce(new Promise(() => {}))
    const loaderText = 'Loading...'
    const customLoaderTestId = 'custom-loader'

    setup({ loader: <div data-testid={customLoaderTestId}>{loaderText}</div> })

    const customLoader = screen.getByTestId(customLoaderTestId)
    expect(customLoader).toBeVisible()
    expect(customLoader).toHaveTextContent(loaderText)
  })

  it('should render a default loader if none is provided', () => {
    mockInitialize.mockResolvedValueOnce(new Promise(() => {}))

    setup()

    expect(screen.queryByTestId(TEST_IDS.MSAL_PROVIDER)).not.toBeInTheDocument()
    expect(screen.getByTestId(MICROSOFT_AUTH_PROVIDER_DEFAULT_LOADER_TEST_ID)).toBeVisible()
  })

  it('should call setActiveAccount and render children when accounts are available', async () => {
    const mockAccounts = [{ username: 'test@example.com' }]
    mockGetAllAccounts.mockReturnValue(mockAccounts)

    setup()

    await checkProviderAndChildren()

    expect(mockSetActiveAccount).toHaveBeenCalledWith(mockAccounts[0])
  })

  it('should handle initialization error and render children', async () => {
    const error = new Error('Initialization error')
    mockInitialize.mockRejectedValueOnce(error)

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    setup()

    await checkProviderAndChildren()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error initializing MSAL:', error)
    consoleErrorSpy.mockRestore()
  })
})
