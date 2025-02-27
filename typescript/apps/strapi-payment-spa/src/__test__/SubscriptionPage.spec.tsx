import fetchMock from 'jest-fetch-mock'
import { waitFor, render, screen } from '../testUtils/testUtils.tsx'
import SubscriptionPage from '../pages/SubscriptionsPage/SubscriptionsPage.tsx'
import { mockInitialProductsArray } from './mocks'
import { Plan } from '../interfaces'

jest.mock('js-cookie', () => ({
  ...jest.requireActual('js-cookie'),
  get: jest.fn().mockResolvedValue({ jwt: 'jwt' })
}))

describe('<SubscriptionPage />', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  const renderComponent = () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockInitialProductsArray))

    return render(<SubscriptionPage />)
  }

  it('should render by default', async () => {
    renderComponent()
    expect(await screen.findByText('Subscription')).toBeVisible()
  })

  it('should render card with data', async () => {
    const { user } = renderComponent()

    waitFor(async () => {
      const productCard = await screen.findByText('Show plans')
      user.click(productCard)
    })
  })

  it('should render plans', async () => {
    const { user } = renderComponent()

    waitFor(async () => {
      user.click(await screen.findByText('Show plans'))

      const activePlan = mockInitialProductsArray[0].plans
      await Promise.all(
        activePlan.map((plan: Plan) => {
          expect(screen.findByText(plan.price.toString())).toBeVisible()
        })
      )
    })
  })
})
