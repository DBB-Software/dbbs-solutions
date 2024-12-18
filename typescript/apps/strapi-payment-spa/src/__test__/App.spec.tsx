import { render, screen, act } from '@testing-library/react'
import App from '../App.tsx'

// TODO: edit router mock
describe.skip('<App />', () => {
  it('should render RegistrationPage properly', () => {
    act(() => {
      render(<App />)
    })

    expect(screen.getByText('Already have an account? Login'))
  })
})
