import fetchMock from 'jest-fetch-mock'
import { useNavigate } from '@tanstack/react-router'
import { render, screen, act } from '../testUtils/testUtils'
import AuthForm from '../components/auth/AuthForm'

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useNavigate: jest.fn()
}))

describe('<AuthForm />', () => {
  const mockedUseNavigate = useNavigate as jest.Mock

  beforeEach(() => {
    fetchMock.resetMocks()
    mockedUseNavigate.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  const renderComponent = (isRegistering: boolean) => render(<AuthForm isRegistering={isRegistering} />)

  it('should render registration form properly', () => {
    act(() => {
      renderComponent(true)
    })

    expect(screen.getByLabelText('Email')).toBeVisible()
    expect(screen.getByLabelText('Password')).toBeVisible()
    expect(screen.getByLabelText('Username')).toBeVisible()
    expect(screen.getByText('Register')).toBeVisible()
  })

  it('should render login form properly', () => {
    act(() => {
      renderComponent(false)
    })

    expect(screen.getByLabelText('Email')).toBeVisible()
    expect(screen.getByLabelText('Password')).toBeVisible()
    expect(screen.queryByLabelText('Username')).toBeNull()
    expect(screen.getByText('Login')).toBeVisible()
  })
})
