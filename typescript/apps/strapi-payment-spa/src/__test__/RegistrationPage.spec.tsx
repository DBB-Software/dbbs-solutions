import { useNavigate } from '@tanstack/react-router'
import { render, screen, act } from '../testUtils/testUtils'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useNavigate: jest.fn()
}))

describe('<RegistrationPage />', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  const mockedUseNavigate = useNavigate as jest.Mock

  beforeEach(() => {
    mockedUseNavigate.mockClear()
  })

  it('should render registration form by default', () => {
    act(() => {
      render(<RegistrationPage />)
    })

    expect(screen.getByText('Already have an account? Login')).toBeVisible()
  })

  it('should switch to login form when link is clicked', async () => {
    const { user } = render(<RegistrationPage />)

    await act(async () => {
      await user.click(screen.getByText('Already have an account? Login'))
    })

    expect(await screen.findByRole('heading', { name: 'Login' })).toBeVisible()
    expect(screen.getByText('Don’t have an account? Register')).toBeVisible()
  })
})
