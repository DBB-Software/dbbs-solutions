import { render, screen } from '../testUtils/testUtils.tsx'
import { PurchasesCard } from '../components/cards/index.ts'
import { mockInitialProductsArray } from './mocks'

jest.mock('js-cookie', () => ({
  ...jest.requireActual('js-cookie'),
  get: jest.fn().mockResolvedValue({ jwt: 'jwt' })
}))

const purchasesMock = {
  orhanizatioName: mockInitialProductsArray[0].name,
  planId: mockInitialProductsArray[0].plans[0].id,
  price: mockInitialProductsArray[0].plans[0].price
}

describe('<PurchasesCard />', () => {
  it('should render default', async () => {
    render(<PurchasesCard {...purchasesMock} />)

    expect(screen.getByText(purchasesMock.orhanizatioName)).toBeVisible()
  })

  it('should render by default', async () => {
    const mockName = `${purchasesMock.orhanizatioName}a`
    render(<PurchasesCard {...purchasesMock} orhanizatioName={mockName} />)

    expect(screen.getByText(`${purchasesMock.orhanizatioName}...`)).toBeVisible()
  })

  it('should render modal', async () => {
    const { user } = render(<PurchasesCard {...purchasesMock} />)

    await user.click(screen.getByText('Buy'))

    expect(screen.getByText('Select Type Commpany')).toBeVisible()
  })
})
