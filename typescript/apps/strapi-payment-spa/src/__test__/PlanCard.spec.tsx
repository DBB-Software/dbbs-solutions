import fetchMock from 'jest-fetch-mock'
import { render, screen } from '../testUtils/testUtils.tsx'
import { PlanType } from '../enums'
import { PlanCard } from '../components/cards/index.ts'
import { mockOrganizations, mockPlan } from './mocks'

jest.mock('js-cookie', () => ({
  ...jest.requireActual('js-cookie'),
  get: jest.fn().mockResolvedValue({ jwt: 'jwt' })
}))
describe('<PlanCard />', () => {
  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(mockOrganizations))
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should render default', async () => {
    render(<PlanCard data={mockPlan} />)

    const priceElement = screen.getByText('Price:', { exact: false })
    expect(priceElement).toHaveTextContent('Price: $10')

    const typeElement = screen.getByText('Type:', { exact: false })
    expect(typeElement).toHaveTextContent('Type: One time')

    expect(await screen.findByText('30day Trial')).toBeVisible()
  })

  it.each([
    [PlanType.Onetime, 'One time'],
    [PlanType.Recurring, 'Recurring']
  ])('should render different type plans', async (type, typeText) => {
    const mockPlanType = { ...mockPlan, type }
    render(<PlanCard data={mockPlanType} />)
    expect(await screen.findByText(`Type: ${typeText}`)).toBeVisible()
  })

  it('should render modal', async () => {
    const { user } = render(<PlanCard data={mockPlan} />)

    await user.click(screen.getByText('Buy'))

    expect(screen.getByText('Select Type Commpany')).toBeVisible()
  })
})
