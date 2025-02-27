import { screen, render, waitFor } from '../../testUtils/testUtils'
import GoogleLogoutButton, { GoogleLogoutButtonProps } from './GoogleLogoutButton'
import { GOOGLE_LOGOUT_BUTTON_TEST_ID } from './testIds'

const mockDisableAutoSelect = jest.fn()
const mockRevoke = jest.fn()

beforeAll(() => {
  global.google = {
    accounts: {
      id: {
        disableAutoSelect: mockDisableAutoSelect,
        revoke: mockRevoke,
        initialize: jest.fn(),
        renderButton: jest.fn(),
        prompt: jest.fn(),
        cancel: jest.fn(),
        storeCredential: jest.fn()
      }
    }
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

const defaultProps: Required<Omit<GoogleLogoutButtonProps, 'className' | 'style' | 'userIdentifier'>> = {
  onSuccess: jest.fn(),
  onError: jest.fn(),
  onRevokeSuccess: jest.fn(),
  onRevokeError: jest.fn(),
  buttonText: 'Logout',
  revokeAccess: false
}

const getGoogleLogoutButton = () => screen.getByTestId(GOOGLE_LOGOUT_BUTTON_TEST_ID)

const setup = (customProps: Partial<GoogleLogoutButtonProps> = {}) =>
  render(<GoogleLogoutButton {...defaultProps} {...customProps} />)

describe('<GoogleLogoutButton />', () => {
  it('should render the default button', () => {
    setup()

    const googleLogoutButton = getGoogleLogoutButton()
    expect(googleLogoutButton).toBeVisible()
    expect(googleLogoutButton).toHaveTextContent(defaultProps.buttonText)
  })

  it('should call onSuccess and onRevokeSuccess on successful logout and token revocation', async () => {
    mockRevoke.mockImplementationOnce((_, callback) => callback({ successful: true }))

    const { user } = setup({ revokeAccess: true })
    await user.click(getGoogleLogoutButton())

    await waitFor(() => {
      expect(mockDisableAutoSelect).toHaveBeenCalledTimes(1)
      expect(mockRevoke).toHaveBeenCalledWith('', expect.any(Function))
      expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1)
      expect(defaultProps.onRevokeSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('should call onRevokeError if token revocation fails', async () => {
    const onRevokeError = jest.fn()
    mockRevoke.mockImplementationOnce((_, callback) => callback({ successful: false, error: 'Revocation failed' }))

    const { user } = setup({ revokeAccess: true, onRevokeError })
    await user.click(getGoogleLogoutButton())

    await waitFor(() => {
      expect(mockRevoke).toHaveBeenCalledTimes(1)
      expect(onRevokeError).toHaveBeenCalledWith(new Error('Revocation failed'))
    })
  })

  it('should skip revocation logic if revokeAccess is false', async () => {
    const { user } = setup({ revokeAccess: false })
    await user.click(getGoogleLogoutButton())

    await waitFor(() => {
      expect(mockRevoke).not.toHaveBeenCalled()
      expect(mockDisableAutoSelect).toHaveBeenCalledTimes(1)
      expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('should apply custom className and style props', () => {
    const customClassName = 'custom-class'
    const customStyle = { backgroundColor: 'red' }

    setup({ className: customClassName, style: customStyle })

    const googleLogoutButton = getGoogleLogoutButton()
    expect(googleLogoutButton).toHaveClass(customClassName)
    expect(googleLogoutButton).toHaveStyle(customStyle)
  })

  it('should handle missing onRevokeSuccess and onRevokeError gracefully', async () => {
    mockRevoke.mockImplementationOnce((_, callback) => callback({ successful: true }))

    const { user } = setup({ revokeAccess: true, onRevokeSuccess: undefined, onRevokeError: undefined })
    await user.click(getGoogleLogoutButton())

    await waitFor(() => {
      expect(mockRevoke).toHaveBeenCalledTimes(1)
    })
  })
})
