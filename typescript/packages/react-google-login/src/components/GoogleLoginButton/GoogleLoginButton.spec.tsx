import { CredentialResponse } from 'google-one-tap'
import { screen, render, waitFor } from '../../testUtils/testUtils'
import GoogleLoginButton, { GoogleLoginButtonProps } from './GoogleLoginButton'
import { GOOGLE_LOGIN_BUTTON_TEST_ID } from './testIds'

const mockInitialize = jest.fn()
const mockRenderButton = jest.fn()
const mockPrompt = jest.fn()

beforeAll(() => {
  global.google = {
    accounts: {
      id: {
        initialize: mockInitialize,
        renderButton: mockRenderButton,
        prompt: mockPrompt,
        disableAutoSelect: jest.fn(),
        storeCredential: jest.fn(),
        cancel: jest.fn(),
        revoke: jest.fn()
      }
    }
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

const defaultProps: GoogleLoginButtonProps = {
  clientId: 'test-client-id',
  onSuccess: jest.fn(),
  onError: jest.fn()
}

const getGoogleLoginButton = () => screen.getByTestId(GOOGLE_LOGIN_BUTTON_TEST_ID)

const setup = (customProps: Partial<GoogleLoginButtonProps> = {}) =>
  render(<GoogleLoginButton {...defaultProps} {...customProps} />)

describe('<GoogleLoginButton />', () => {
  it('should initialize Google Identity Services and render the button', async () => {
    setup()

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: defaultProps.clientId,
          callback: expect.any(Function)
        })
      )
    })

    expect(mockRenderButton).toHaveBeenCalledTimes(1)
    expect(mockPrompt).toHaveBeenCalledTimes(1)
  })

  it('should call onSuccess with a valid credential response', async () => {
    const credentialResponse: CredentialResponse = { credential: 'test-credential', select_by: 'user' }
    mockInitialize.mockImplementation(({ callback }) => {
      callback(credentialResponse)
    })

    setup()

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalledWith(credentialResponse)
    })
  })

  it('should apply custom className and style props', () => {
    const customClassName = 'custom-class'
    const customStyle = { backgroundColor: 'red' }

    setup({ className: customClassName, style: customStyle })

    const googleLogoutButton = getGoogleLoginButton()
    expect(googleLogoutButton).toHaveClass(customClassName)
    expect(googleLogoutButton).toHaveStyle(customStyle)
  })

  it('should call onError if button rendering fails', async () => {
    const error = new Error('Button rendering failed')
    mockRenderButton.mockImplementationOnce(() => {
      throw error
    })

    setup()

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(error)
    })
  })

  it('should call onError if Google Identity Services initialization fails', async () => {
    const error = new Error('Initialization failed')
    mockInitialize.mockImplementation(() => {
      throw error
    })

    setup()

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(error)
    })
  })

  it('should handle an empty credential response gracefully', async () => {
    const emptyResponse: CredentialResponse = { credential: '', select_by: 'user' }
    mockInitialize.mockImplementation(({ callback }) => {
      callback(emptyResponse)
    })

    setup()

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(new Error('Credential response is empty'))
    })
  })

  it('should render the button with correct options', async () => {
    setup({
      buttonText: 'signup_with',
      theme: 'filled_blue',
      size: 'medium',
      shape: 'pill'
    })

    await waitFor(() => {
      expect(mockRenderButton).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          text: 'signup_with',
          theme: 'filled_blue',
          size: 'medium',
          shape: 'pill'
        })
      )
    })
  })
})
