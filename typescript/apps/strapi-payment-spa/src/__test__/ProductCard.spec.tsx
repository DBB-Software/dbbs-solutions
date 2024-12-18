import { render, screen } from '../testUtils/testUtils.tsx'
import { ProductCard } from '../components/cards/index.ts'
import { mockProductData } from './mocks/default/products.mock.ts'

describe('<ProductCard />', () => {
  it('should render default', async () => {
    render(<ProductCard buttonHandler={() => {}} data={mockProductData} />)

    expect(screen.getByText(mockProductData.name)).toBeVisible()
  })

  it('should render by default', async () => {
    const mockName = `${mockProductData.name} asd`
    render(<ProductCard buttonHandler={() => {}} data={{ ...mockProductData, name: mockName }} />)

    expect(screen.getByText(`${mockProductData.name} ...`)).toBeVisible()
  })

  it('should work with click', async () => {
    const mockButtonHandler = jest.fn()
    const { user } = render(<ProductCard buttonHandler={mockButtonHandler} data={mockProductData} />)

    const buttonShowPlans = screen.getByText('Show plans')
    expect(buttonShowPlans).toBeVisible()

    await user.click(buttonShowPlans)

    expect(buttonShowPlans).toBeEnabled()
    expect(mockButtonHandler).toHaveBeenCalledTimes(1)
  })
})
