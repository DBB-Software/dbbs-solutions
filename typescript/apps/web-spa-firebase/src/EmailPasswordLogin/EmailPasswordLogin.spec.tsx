import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@dbbs/firebase/app-auth'

import EmailPasswordLogin from './EmailPasswordLogin'
import { EMAIL_PASSWORD_LOGIN_TEST_IDS } from './testIds'
import { LOGIN_WRAPPER_TEST_IDS } from '../LoginWrapper/testIds'
import { render, screen, UserEvent } from '../testUtils/testUtils'

jest.mock('@dbbs/firebase/app-auth', () => ({
  getAuth: jest.fn().mockReturnValue({}),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn().mockReturnValue(() => undefined)
}))

const createUserWithEmailAndPasswordMock = createUserWithEmailAndPassword as jest.Mock
const signInWithEmailAndPasswordMock = signInWithEmailAndPassword as jest.Mock

const email = 'test@user.com'
const password = 'password123'

const fillEmailPasswordForm = async (user: UserEvent) => {
  await user.type(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT), email)
  await user.type(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT), password)
}

const setup = () => render(<EmailPasswordLogin />)

const setupWithFormFill = async (buttonId = EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_UP_BUTTON) => {
  const { user } = setup()

  await fillEmailPasswordForm(user)

  await user.click(screen.getByTestId(buttonId))
}

describe('EmailPasswordLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render successfully', () => {
    setup()

    expect(screen.getByTestId(LOGIN_WRAPPER_TEST_IDS.TITLE)).toBeVisible()

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT)).toBeVisible()
    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT)).toBeVisible()

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_UP_BUTTON)).toBeVisible()
    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_IN_BUTTON)).toBeVisible()
  })

  it('should show error if fields are empty during Sign Up', async () => {
    const { user } = setup()

    await user.click(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_UP_BUTTON))

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.ERROR_MESSAGE)).toBeVisible()

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('should call createUserWithEmailAndPassword on Sign Up and clear fields', async () => {
    createUserWithEmailAndPasswordMock.mockResolvedValue({ user: {} })

    await setupWithFormFill()

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), email, password)

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT)).toHaveValue('')
    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT)).toHaveValue('')
  })

  it('should show error on Sign Up if createUserWithEmailAndPassword throws error', async () => {
    createUserWithEmailAndPasswordMock.mockRejectedValue(new Error('Some error'))

    await setupWithFormFill()

    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1)

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.ERROR_MESSAGE)).toBeVisible()
  })

  it('should show error fields are empty during Sign In', async () => {
    const { user } = setup()

    await user.click(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_IN_BUTTON))

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.ERROR_MESSAGE)).toBeVisible()

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('should call signInWithEmailAndPassword and clear fields on successful Sign In', async () => {
    signInWithEmailAndPasswordMock.mockResolvedValue({ user: {} })

    await setupWithFormFill(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_IN_BUTTON)

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), email, password)

    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.EMAIL_INPUT)).toHaveValue('')
    expect(screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.PASSWORD_INPUT)).toHaveValue('')
  })

  it('should show error if signInWithEmailAndPassword throws error during Sign In', async () => {
    const errorText = 'Wrong password'
    signInWithEmailAndPasswordMock.mockRejectedValue(new Error(errorText))

    await setupWithFormFill(EMAIL_PASSWORD_LOGIN_TEST_IDS.SIGN_IN_BUTTON)

    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1)

    const errorMessage = screen.getByTestId(EMAIL_PASSWORD_LOGIN_TEST_IDS.ERROR_MESSAGE)
    expect(errorMessage).toBeVisible()
    expect(errorMessage).toHaveTextContent(errorText)
  })
})
