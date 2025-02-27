import { render } from '@testing-library/react'
import React from 'react'
import { SidebarLink } from './SidebarLink'
import { NavigationLink } from '../../utils'

const mockLink: NavigationLink & { isActive: boolean } = {
  label: 'Dashboard',
  link: '/dashboard',
  key: 'dashboard',
  isActive: false
}

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useRouterState: jest.fn(() => ({
    location: { pathname: '/' }
  })),
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>)
}))

jest.mock('@dbbs/mui-components', () => ({
  ...jest.requireActual('@dbbs/mui-components'),
  useMediaQuery: jest.fn(() => true)
}))

describe('<Layout />', () => {
  it('renders correctly', async () => {
    const { asFragment } = render(<SidebarLink {...mockLink} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
