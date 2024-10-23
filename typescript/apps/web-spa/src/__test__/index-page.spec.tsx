import fetchMock from 'jest-fetch-mock'
import { Index } from '../routes/index.lazy'
import { render, screen, waitFor } from '../testUtils/customRender'

describe('index page', () => {
  beforeEach(() => {
    fetchMock.mockIf(/settings/, JSON.stringify({ settings: { TENANTS: { TENANT1: {}, TENANT2: {} } } }))
  })

  it('should render properly', async () => {
    render(<Index />)
    const loadingComponent = await screen.findByText('Loading...')
    expect(loadingComponent).toBeVisible()

    waitFor(() => {
      expect(loadingComponent).not.toBeInTheDocument()
    })

    const tenant1 = await screen.findByText('TENANT1')
    const tenant2 = await screen.findByText('TENANT2')

    expect(tenant1).toBeVisible()
    expect(tenant2).toBeVisible()
    expect(screen.getByText('Sample APP')).toBeVisible()
  })
})
