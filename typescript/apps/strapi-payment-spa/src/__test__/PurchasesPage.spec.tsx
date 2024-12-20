import fetchMock from 'jest-fetch-mock'
import { waitFor, render, screen } from '../testUtils/testUtils.tsx'
import { mockInitialProductsArray } from './mocks/index.ts'
import PurchasesPage from '../pages/PurchasesPage/PurchasesPage.tsx'

jest.mock('js-cookie', () => ({
  ...jest.requireActual('js-cookie'),
  get: jest.fn().mockResolvedValue({ jwt: 'jwt' })
}))
describe('<PurchasesPage />', () => {
  const renderComponent = () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockInitialProductsArray))

    return render(<PurchasesPage />)
  }

  it('should render by default', async () => {
    renderComponent()
    expect(screen.getByText('Purchases')).toBeVisible()
  })

  it('should render card with data', async () => {
    renderComponent()

    waitFor(() => {
      expect(screen.getByText(mockInitialProductsArray[0].name)).toBeVisible()
    })
  })
})
