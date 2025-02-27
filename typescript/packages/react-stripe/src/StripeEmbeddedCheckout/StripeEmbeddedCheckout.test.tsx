import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

import { render, screen } from '../testUtils/testUtils'
import { useLoadStripe } from '../useLoadStripe'
import StripeEmbeddedCheckout from './StripeEmbeddedCheckout'

const TEST_IDS = {
  EMBEDDED_CHECKOUT: 'embedded-checkout',
  EMBEDDED_CHECKOUT_PROVIDER: 'embedded-checkout-provider'
}

jest.mock('@stripe/react-stripe-js', () => ({
  EmbeddedCheckoutProvider: jest.fn(({ children }) => (
    <div data-testid={TEST_IDS.EMBEDDED_CHECKOUT_PROVIDER}>{children}</div>
  )),
  EmbeddedCheckout: jest.fn(() => <div data-testid={TEST_IDS.EMBEDDED_CHECKOUT} />)
}))

jest.mock('../useLoadStripe', () => ({
  useLoadStripe: jest.fn().mockReturnValue(Promise.resolve({}))
}))

const mockedUseLoadStripe = useLoadStripe as jest.Mock
const mockedEmbeddedCheckoutProvider = EmbeddedCheckoutProvider as jest.Mock
const mockedEmbeddedCheckout = EmbeddedCheckout as jest.Mock

const PUBLIC_KEY = 'pk_test_123'
const CLIENT_SECRET = 'test_secret'
const EMBEDDED_CHECKOUT_CLASSNAME = 'test-class'
const EMBEDDED_CHECKOUT_ID = 'test-id'

describe('StripeEmbeddedCheckout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders EmbeddedCheckout inside EmbeddedCheckoutProvider with correct props', () => {
    render(
      <StripeEmbeddedCheckout
        stripePublicKey={PUBLIC_KEY}
        options={{ clientSecret: CLIENT_SECRET }}
        className={EMBEDDED_CHECKOUT_CLASSNAME}
        id={EMBEDDED_CHECKOUT_ID}
      />
    )

    expect(mockedUseLoadStripe).toHaveBeenCalledTimes(1)
    expect(mockedUseLoadStripe).toHaveBeenCalledWith(PUBLIC_KEY)

    expect(mockedEmbeddedCheckoutProvider).toHaveBeenCalledTimes(1)
    expect(mockedEmbeddedCheckoutProvider.mock.calls[0][0]).toMatchObject({
      stripe: expect.any(Promise),
      options: { clientSecret: CLIENT_SECRET }
    })

    expect(mockedEmbeddedCheckout).toHaveBeenCalledTimes(1)
    expect(mockedEmbeddedCheckout.mock.calls[0][0]).toMatchObject({
      className: EMBEDDED_CHECKOUT_CLASSNAME,
      id: EMBEDDED_CHECKOUT_ID
    })

    expect(screen.getByTestId(TEST_IDS.EMBEDDED_CHECKOUT_PROVIDER)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.EMBEDDED_CHECKOUT)).toBeInTheDocument()
  })
})
