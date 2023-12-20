import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  it('should render properly', () => {
    render(<App />)

    expect(screen.getByText('Sample APP')).toBeVisible()
  })
})
