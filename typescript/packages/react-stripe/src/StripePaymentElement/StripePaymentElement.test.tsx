import { Elements, PaymentElement, useStripe } from '@stripe/react-stripe-js'
import { Appearance, ConfirmPaymentData } from '@stripe/stripe-js'

import { render, screen } from '../testUtils/testUtils'
import { useLoadStripe } from '../useLoadStripe'
import StripePaymentElement from './StripePaymentElement'

const TEST_IDS = {
  ELEMENTS: 'elements',
  PAYMENT_ELEMENT: 'payment-element',
  CHILDREN: 'payment-children'
}

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: jest.fn(({ children }) => <div data-testid={TEST_IDS.ELEMENTS}>{children}</div>),
  PaymentElement: jest.fn(() => <div data-testid={TEST_IDS.PAYMENT_ELEMENT} />),
  useElements: jest.fn().mockReturnValue({}),
  useStripe: jest.fn()
}))

jest.mock('../useLoadStripe', () => ({
  useLoadStripe: jest.fn().mockResolvedValue(Promise.resolve({}))
}))

const mockedUseLoadStripe = useLoadStripe as jest.Mock
const mockedUseStripe = useStripe as jest.Mock
const mockedElements = Elements as jest.Mock
const mockedPaymentElement = PaymentElement as jest.Mock
const mockConfirmPayment = jest.fn().mockReturnValue({})

const PUBLIC_KEY = 'pk_test_123'
const CLIENT_SECRET = 'test_secret'
const APPEARANCE = { theme: 'stripe' } as Appearance
const LOADER = 'auto'
const PAYMENT_ELEMENT_CLASSNAME = 'test-class'
const PAYMENT_ELEMENT_ID = 'test-id'
const CONFIRM_PARAMS: ConfirmPaymentData = {
  return_url: 'https://example.com'
}

const setup = () =>
  render(
    <StripePaymentElement
      stripePublicKey={PUBLIC_KEY}
      clientSecret={CLIENT_SECRET}
      appearance={APPEARANCE}
      loader={LOADER}
      className={PAYMENT_ELEMENT_CLASSNAME}
      id={PAYMENT_ELEMENT_ID}
      confirmParams={CONFIRM_PARAMS}
    >
      <button type="submit" data-testid={TEST_IDS.CHILDREN}>
        Pay
      </button>
    </StripePaymentElement>
  )

describe('StripePaymentElement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders PaymentElement inside Elements with correct props and call confirm payment on button call', async () => {
    setup()

    expect(mockedUseLoadStripe).toHaveBeenCalledTimes(1)
    expect(mockedUseLoadStripe).toHaveBeenCalledWith(PUBLIC_KEY)

    expect(mockedElements).toHaveBeenCalledTimes(1)
    expect(mockedElements.mock.calls[0][0]).toMatchObject({
      stripe: expect.any(Promise),
      options: {
        clientSecret: CLIENT_SECRET,
        appearance: APPEARANCE,
        loader: LOADER
      }
    })

    expect(mockedPaymentElement).toHaveBeenCalledTimes(1)
    expect(mockedPaymentElement.mock.calls[0][0]).toMatchObject({
      className: PAYMENT_ELEMENT_CLASSNAME,
      id: PAYMENT_ELEMENT_ID
    })

    expect(screen.getByTestId(TEST_IDS.ELEMENTS)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.PAYMENT_ELEMENT)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.CHILDREN)).toBeInTheDocument()
  })

  it('calls confirm payment on button call with passed confirmParams', async () => {
    mockedUseStripe.mockReturnValueOnce({
      confirmPayment: mockConfirmPayment
    })

    const { user } = setup()

    const submitButton = screen.getByTestId(TEST_IDS.CHILDREN)
    await user.click(submitButton)

    expect(mockConfirmPayment).toHaveBeenCalledTimes(1)
    expect(mockConfirmPayment).toHaveBeenCalledWith({
      elements: {},
      confirmParams: CONFIRM_PARAMS
    })
  })
})
