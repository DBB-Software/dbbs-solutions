import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from '@dbbs/firebase/app-auth'
import PasswordlessLogin, { LOCAL_STORAGE_EMAIL_KEY } from './PasswordlessLogin'
import { render, screen, waitFor } from '../testUtils/testUtils'
import { PASSWORDLESS_LOGIN_TEST_IDS } from './testIds'
import { LOGIN_WRAPPER_TEST_IDS } from '../LoginWrapper/testIds'

jest.mock('@dbbs/firebase/app-auth', () => ({
  getAuth: jest.fn(),
  isSignInWithEmailLink: jest.fn().mockReturnValue(false),
  sendSignInLinkToEmail: jest.fn(),
  signInWithEmailLink: jest.fn().mockResolvedValue(true),
  onAuthStateChanged: jest.fn().mockReturnValue(() => undefined)
}))

const email = 'test@user.com'
const mockAuth = {}

const isSignInWithEmailLinkMock = isSignInWithEmailLink as jest.Mock
const signInWithEmailLinkMock = signInWithEmailLink as jest.Mock
const sendSignInLinkToEmailMock = sendSignInLinkToEmail as jest.Mock
const getAuthMock = getAuth as jest.Mock

const setup = () => render(<PasswordlessLogin />)

describe('PasswordlessLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it('should render title and email form successfully', () => {
    setup()

    expect(screen.getByTestId(LOGIN_WRAPPER_TEST_IDS.TITLE)).toBeVisible()
    expect(screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT)).toBeVisible()
    expect(screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.SEND_LINK_BUTTON)).toBeVisible()
  })

  it('should not call signInWithEmailLink on initial render if there is no saved email', () => {
    setup()

    expect(signInWithEmailLink).not.toHaveBeenCalled()
  })

  it('should call signInWithEmailLink if isSignInWithEmailLink is true', async () => {
    getAuthMock.mockReturnValue(mockAuth)
    isSignInWithEmailLinkMock.mockReturnValue(true)
    window.localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email)

    setup()

    expect(signInWithEmailLink).toHaveBeenCalledWith(expect.any(Object), email, expect.any(String))

    await waitFor(() => {
      expect(window.localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY)).toBeNull()
    })
  })

  it('should call sendSignInLinkToEmail on send link button click with filled in email', async () => {
    getAuthMock.mockReturnValue(mockAuth)
    isSignInWithEmailLinkMock.mockReturnValue(false)

    const { user } = setup()

    const emailInput = screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT)
    await user.type(emailInput, email)

    const sendLinkButton = screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.SEND_LINK_BUTTON)
    await user.click(sendLinkButton)

    expect(sendSignInLinkToEmail).toHaveBeenCalledWith(
      mockAuth,
      email,
      expect.objectContaining({
        url: 'http://localhost:5173',
        handleCodeInApp: true
      })
    )

    await waitFor(() => {
      expect(screen.getByText(`Link is send to ${email}`)).toBeInTheDocument()
    })

    expect(window.localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY)).toEqual(email)
  })

  it('should not call sendSignInLinkToEmail if email is empty', async () => {
    isSignInWithEmailLinkMock.mockReturnValue(false)

    const { user } = setup()

    const sendLinkButton = screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.SEND_LINK_BUTTON)
    await user.click(sendLinkButton)

    expect(sendSignInLinkToEmail).not.toHaveBeenCalled()
  })

  it('should log error if signInWithEmailLink throws error', async () => {
    getAuthMock.mockReturnValue(mockAuth)
    isSignInWithEmailLinkMock.mockReturnValue(true)
    signInWithEmailLinkMock.mockRejectedValue(new Error('SignIn error'))
    window.localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email)

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    setup()

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error login using email-link:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })

  it('should log error if sendSignInLinkToEmail throws error', async () => {
    getAuthMock.mockReturnValue(mockAuth)
    sendSignInLinkToEmailMock.mockRejectedValue(new Error('SendLink error'))

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { user } = setup()

    const emailInput = screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.EMAIL_INPUT)
    await user.type(emailInput, email)

    const sendLinkButton = screen.getByTestId(PASSWORDLESS_LOGIN_TEST_IDS.SEND_LINK_BUTTON)
    await user.click(sendLinkButton)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending link:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })
})
