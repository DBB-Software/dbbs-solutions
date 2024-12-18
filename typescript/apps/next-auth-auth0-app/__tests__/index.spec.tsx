import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

describe('Home', () => {
  it('should render properly', () => {
    render(<Home />)
    const title = screen.getByText('Hello from NextJS!')

    expect(title).toBeVisible()
  })
})
