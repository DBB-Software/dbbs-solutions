import fetchMock from 'jest-fetch-mock'
import userEvent from '@testing-library/user-event/index'
import { render, screen, waitFor } from '../testUtils/testUtils.tsx'
import PaymentModal from '../components/modals/paymentModal/PaymentModal.tsx'
import { mockOrganizations } from './mocks/index.ts'

const url = 'https://api.example.com/api/v1/subscribe'

jest.mock('js-cookie', () => ({
  ...jest.requireActual('js-cookie'),
  get: jest.fn().mockResolvedValue({ jwt: 'jwt' })
}))

jest.setTimeout(30000)

export async function selectExistingOrganizationMock(user: ReturnType<typeof userEvent.setup>) {
  const buttonExisingOrganization = await screen.findByText('Existing Organization')
  await user.click(buttonExisingOrganization)

  const selectElement = screen.getByRole('combobox')
  expect(selectElement).toBeVisible()

  await user.click(selectElement)
}

describe('<PaymentModal />', () => {
  beforeAll(() => {
    jest.spyOn(window, 'open').mockImplementation(jest.fn())
  })

  const renderComponent = (mock: { id: number; name: string }[] = [], handleClose = () => {}) => {
    fetchMock.mockResponseOnce(JSON.stringify(mock))

    return render(<PaymentModal planId={1} open={true} handleClose={handleClose} />)
  }

  it('should render by default', async () => {
    const { user } = renderComponent(mockOrganizations)
    expect(await screen.findByText('Select Type Commpany')).toBeVisible()
    await selectExistingOrganizationMock(user)
    expect(await screen.findByText(mockOrganizations[0].name)).toBeVisible()
  })

  it('should call handleClose', async () => {
    const handleClose = jest.fn()
    const { user } = renderComponent([], handleClose)

    await user.keyboard('[Escape]')

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should render disabled new organization button', async () => {
    const { user } = renderComponent()

    const inputNewOrganization = screen.getByLabelText('Name Organization')
    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.clear(inputNewOrganization)
    await user.type(inputQuantity, '1')

    expect(buttonSubmit).toBeDisabled()
  })

  it('should render disabled existing organization button', async () => {
    const { user } = renderComponent(mockOrganizations)

    const buttonExisingOrganization = await screen.findByText('Existing Organization')

    await user.click(buttonExisingOrganization)

    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.type(inputQuantity, '1')

    expect(buttonSubmit).toBeDisabled()
  })

  it('should work submit a new organization form and open a new tab', async () => {
    jest.setTimeout(10000)

    const { user } = renderComponent()
    fetchMock.mockResponseOnce(JSON.stringify({ url }))

    const inputNewOrganization = screen.getByLabelText('Name Organization')
    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.type(inputNewOrganization, 'My Organization')
    await user.type(inputQuantity, '100')
    await user.click(buttonSubmit)

    expect(buttonSubmit).toBeEnabled()

    await user.click(buttonSubmit)

    await waitFor(
      () => {
        expect(window.open).toHaveBeenCalledWith(url, '_blank')
      },
      { timeout: 5000 }
    )
  })

  it('should work submit a existing organization form and open a new tab', async () => {
    jest.setTimeout(10000)

    const { user } = renderComponent(mockOrganizations)
    fetchMock.mockResponseOnce(JSON.stringify({ url }))

    await selectExistingOrganizationMock(user)

    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')
    const listItem = await screen.findByText('Organization 1')

    user.click(listItem)
    await user.type(inputQuantity, '100')

    user.click(listItem)

    expect(buttonSubmit).toBeEnabled()

    user.click(buttonSubmit)

    await waitFor(
      () => {
        expect(window.open).toHaveBeenCalledWith(url, '_blank')
      },
      { timeout: 5000 }
    )
  })
})
