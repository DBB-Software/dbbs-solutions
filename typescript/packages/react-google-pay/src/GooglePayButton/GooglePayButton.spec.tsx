import { render, screen, waitFor } from '../testUtils/testUtils'
import GooglePayButton from './GooglePayButton'

const mockOnLoadPaymentData = jest.fn()
const mockOnError = jest.fn()
const mockOnClick = jest.fn()

class MockPaymentsClient implements google.payments.api.PaymentsClient {
  isReadyToPay(): Promise<google.payments.api.IsReadyToPayResponse> {
    return Promise.resolve({ result: true })
  }

  loadPaymentData(request: google.payments.api.PaymentDataRequest): Promise<google.payments.api.PaymentData> {
    return Promise.resolve({
      apiVersion: request.apiVersion ?? 2,
      apiVersionMinor: request.apiVersionMinor ?? 0,
      paymentMethodData: {
        type: 'CARD',
        description: 'Visa **** 1234',
        info: {
          cardDetails: '1234',
          cardNetwork: 'VISA'
        },
        tokenizationData: {
          type: 'PAYMENT_GATEWAY',
          token: 'mock-token-123'
        }
      }
    })
  }

  prefetchPaymentData(): Promise<void> {
    return Promise.resolve()
  }

  createButton(options: google.payments.api.ButtonOptions): HTMLElement {
    const button = document.createElement('button')
    button.setAttribute('role', 'button')
    button.setAttribute('aria-label', 'Google Pay')
    button.setAttribute('data-testid', 'google-pay-button')
    button.textContent = 'Google Pay'

    button.addEventListener('click', (event) => {
      if (options.onClick) {
        options.onClick(event)
      }
    })

    return button
  }
}

const createButtonSpy = jest.spyOn(MockPaymentsClient.prototype, 'createButton')
const isReadyToPaySpy = jest.spyOn(MockPaymentsClient.prototype, 'isReadyToPay')
const prefetchPaymentDataSpy = jest.spyOn(MockPaymentsClient.prototype, 'prefetchPaymentData')
const loadPaymentDataSpy = jest.spyOn(MockPaymentsClient.prototype, 'loadPaymentData')

beforeAll(() => {
  global.google = {
    payments: {
      api: {
        PaymentsClient: MockPaymentsClient
      }
    }
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

const mockPaymentRequest: google.payments.api.PaymentDataRequest = {
  merchantInfo: {
    merchantName: 'Mock Merchant',
    merchantId: 'TEST_MERCHANT_ID'
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPrice: '20.00',
    currencyCode: 'USD'
  },
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['VISA', 'MASTERCARD']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'stripe',
          gatewayMerchantId: '123456789'
        }
      }
    }
  ],
  apiVersion: 2,
  apiVersionMinor: 0
}

const getGooglePayButton = () => screen.getByTestId('google-pay-button')

const setup = async (props = {}) => {
  const { user } = render(
    <GooglePayButton
      paymentRequest={mockPaymentRequest}
      onLoadPaymentData={mockOnLoadPaymentData}
      onError={mockOnError}
      onClick={mockOnClick}
      {...props}
    />
  )

  await waitFor(() => {
    expect(createButtonSpy).toHaveBeenCalled()
  })

  return user
}

describe('<GooglePayButton />', () => {
  it('should render the Google Pay button and call isReadyToPay', async () => {
    await setup()

    const button = getGooglePayButton()
    expect(button).toBeVisible()
    expect(button).toHaveTextContent('Google Pay')
    expect(prefetchPaymentDataSpy).toHaveBeenCalledTimes(1)
    expect(isReadyToPaySpy).toHaveBeenCalledTimes(1)
  })

  it('should call onLoadPaymentData when payment data is loaded', async () => {
    const mockPaymentData: google.payments.api.PaymentData = {
      apiVersion: mockPaymentRequest.apiVersion,
      apiVersionMinor: mockPaymentRequest.apiVersionMinor,
      paymentMethodData: {
        type: 'CARD',
        description: 'Visa **** 1234',
        info: {
          cardDetails: '1234',
          cardNetwork: 'VISA'
        },
        tokenizationData: {
          type: 'PAYMENT_GATEWAY',
          token: 'mock-token-123'
        }
      }
    }

    const user = await setup()

    const button = getGooglePayButton()
    await user.click(button)

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(loadPaymentDataSpy).toHaveBeenCalledTimes(1)
      expect(mockOnLoadPaymentData).toHaveBeenCalledTimes(1)
      expect(mockOnLoadPaymentData).toHaveBeenCalledWith(mockPaymentData)
    })
  })

  it('should call onError when an error occurs', async () => {
    const mockError = new Error('Test error')
    jest.spyOn(MockPaymentsClient.prototype, 'loadPaymentData').mockRejectedValue(mockError)

    const user = await setup()

    const button = getGooglePayButton()
    await user.click(button)

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(loadPaymentDataSpy).toHaveBeenCalledTimes(1)
      expect(mockOnError).toHaveBeenCalledTimes(1)
      expect(mockOnError).toHaveBeenCalledWith(mockError)
    })
  })

  it('should propagate all required props to paymentRequest', async () => {
    await setup()

    await waitFor(() => {
      expect(isReadyToPaySpy).toHaveBeenCalledWith(
        expect.objectContaining({ allowedPaymentMethods: mockPaymentRequest.allowedPaymentMethods })
      )
    })
  })

  it('should handle TEST environment correctly', async () => {
    await setup({ environment: 'TEST' })

    expect(isReadyToPaySpy).toHaveBeenCalledTimes(1)
  })
})
