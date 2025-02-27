import { render } from '@testing-library/react'
import React from 'react'
import { Layout } from './Layout'

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useRouterState: jest.fn(() => ({
    location: { pathname: '/' }
  })),
  Link: jest.fn()
}))

jest.mock('@dbbs/mui-components', () => ({
  ...jest.requireActual('@dbbs/mui-components'),
  useMediaQuery: jest.fn(() => true)
}))

describe('<Layout />', () => {
  it('renders correctly', async () => {
    const { asFragment } = render(<Layout />)

    expect(asFragment()).toMatchSnapshot()
  })
})
