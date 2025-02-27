import { onAuthStateChanged, signOut } from '@dbbs/firebase/app-auth'

import { render, screen } from '../testUtils/testUtils'
import LoginWrapper from './LoginWrapper'
import { LOGIN_WRAPPER_TEST_IDS } from './testIds'

jest.mock('@dbbs/firebase/app-auth', () => ({
  onAuthStateChanged: jest.fn().mockReturnValue(() => undefined),
  getAuth: jest.fn(),
  signOut: jest.fn()
}))

const onAuthStateChangedMock = onAuthStateChanged as jest.Mock

const childrenDataTestId = 'children'
const title = 'Test Title'
const email = 'test@user.com'

const setup = () =>
  render(
    <LoginWrapper title={title}>
      <div data-testid={childrenDataTestId}>Children</div>
    </LoginWrapper>
  )

describe('LoginWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title and children successfully', () => {
    setup()

    const titleElement = screen.getByTestId(LOGIN_WRAPPER_TEST_IDS.TITLE)
    expect(titleElement).toBeVisible()
    expect(titleElement).toHaveTextContent(title)

    const children = screen.getByTestId(childrenDataTestId)
    expect(children).toBeVisible()
  })

  it('should show user info and logout if user is logged in', () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ email })
      return () => undefined
    })

    setup()

    const userEmailElement = screen.getByTestId(LOGIN_WRAPPER_TEST_IDS.USER_EMAIL)

    expect(userEmailElement).toBeVisible()
    expect(userEmailElement).toHaveTextContent(`You logged in as: ${email}`)
    expect(screen.queryByTestId(childrenDataTestId)).not.toBeInTheDocument()
  })

  it('should call signOut on logout button click', async () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback({ email })
      return () => undefined
    })

    const { user } = setup()

    const logoutButton = screen.getByTestId(LOGIN_WRAPPER_TEST_IDS.LOGOUT_BUTTON)
    await user.click(logoutButton)

    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
