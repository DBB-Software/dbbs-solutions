import { render, screen } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import App from './App'

describe('<App />', () => {
  beforeAll(() => {
    fetchMock.mockIf(/settings/, JSON.stringify({ settings: { TENANTS: { TENANT1: {}, TENANT2: {} } } }))
  })

  it('should render properly', async () => {
    render(<App />)
    const tenant1 = await screen.findByText('TENANT1')
    const tenant2 = await screen.findByText('TENANT2')

    expect(tenant1).toBeVisible()
    expect(tenant2).toBeVisible()
    expect(screen.getByText('Sample APP')).toBeVisible()
  })
})
