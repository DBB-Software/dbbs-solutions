import fetchMock from 'jest-fetch-mock'
import userEvent from '@testing-library/user-event/index'
import { render, screen, waitFor } from '../testUtils/testUtils.tsx'
import SubscribeModal from '../components/modals/subscribeModal/SubscribeModal.tsx'
import { mockOrganizations } from './mocks'

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

describe('<SubscribeModal />', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  const renderComponent = (mock: { id: number; name: string }[] = []) => {
    fetchMock.mockResponseOnce(JSON.stringify(mock))

    return render(<SubscribeModal planId={1} open={true} handleClose={() => {}} />)
  }

  it('should render by default', async () => {
    const { user } = renderComponent(mockOrganizations)

    expect(await screen.findByText('Select Type Commpany')).toBeVisible()

    await selectExistingOrganizationMock(user)

    expect(await screen.findByText(mockOrganizations[0].name)).toBeVisible()
  })

  it('should render disabled new organization button', async () => {
    const { user } = renderComponent()

    const inputNewOrganization = screen.getByLabelText('Name Organization')
    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.clear(inputNewOrganization)
    await user.type(inputQuantity, '1')

    expect(buttonSubmit).toBeDisabled()
  }, 10000)

  it('should render disabled existing organization button', async () => {
    const { user } = renderComponent(mockOrganizations)

    const buttonExisingOrganization = await screen.findByText('Existing Organization')

    await user.click(buttonExisingOrganization)

    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.type(inputQuantity, '1')

    expect(buttonSubmit).toBeDisabled()
  })

  it.skip('should work submit a new organization form and open a new tab', async () => {
    const { user } = renderComponent()
    fetchMock.mockResponseOnce(JSON.stringify({ url }))
    window.open = jest.fn()

    const inputNewOrganization = screen.getByLabelText('Name Organization')
    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')

    await user.type(inputNewOrganization, 'My Organization')
    await user.type(inputQuantity, '100')
    await user.click(buttonSubmit)

    expect(buttonSubmit).toBeEnabled()

    await user.click(buttonSubmit)

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(url, '_blank')
    })
  })

  it('should work submit a existing organization form and open a new tab', async () => {
    jest.setTimeout(10000)
    const { user } = renderComponent(mockOrganizations)
    fetchMock.mockResponseOnce(JSON.stringify({ url }))
    window.open = jest.fn()

    await selectExistingOrganizationMock(user)

    const inputQuantity = screen.getByLabelText('Quantity')
    const buttonSubmit = screen.getByText('Send')
    const listItem = await screen.findByText('Organization 1')

    await user.click(listItem)
    await user.type(inputQuantity, '100')

    await user.click(listItem)

    expect(buttonSubmit).toBeEnabled()

    await user.click(buttonSubmit)

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(url, '_blank')
    })
  })
})
