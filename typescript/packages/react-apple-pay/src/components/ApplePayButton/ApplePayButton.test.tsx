import { screen, waitFor } from '@testing-library/react'
import ApplePayButton, { ApplePayButtonProps } from './ApplePayButton'
import { render } from '../../testUtils/testUtils'
import { APPLE_PAY_BUTTON_TEST_ID } from './testIds'

const mockCanMakePayments = jest.fn()
const mockBegin = jest.fn()
const mockCompleteMerchantValidation = jest.fn()
const mockCompletePayment = jest.fn()
const mockCompletePaymentMethodSelection = jest.fn()
const mockCompleteShippingMethodSelection = jest.fn()
const mockCompleteShippingContactSelection = jest.fn()
const mockCompleteCouponCodeChange = jest.fn()
const mockAbort = jest.fn()
const mockOncancel = jest.fn()

const mockApplePaySessionConstructor = jest.fn().mockImplementation(() => ({
  begin: mockBegin,
  completeMerchantValidation: mockCompleteMerchantValidation,
  completePayment: mockCompletePayment,
  completePaymentMethodSelection: mockCompletePaymentMethodSelection,
  completeShippingMethodSelection: mockCompleteShippingMethodSelection,
  completeShippingContactSelection: mockCompleteShippingContactSelection,
  completeCouponCodeChange: mockCompleteCouponCodeChange,
  abort: mockAbort,
  oncancel: mockOncancel
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalObject = global as any

globalObject.ApplePaySession = mockApplePaySessionConstructor
globalObject.ApplePaySession.canMakePayments = mockCanMakePayments
globalObject.ApplePaySession.STATUS_SUCCESS = 0
globalObject.ApplePaySession.STATUS_FAILURE = 1

const paymentRequest: ApplePayJS.ApplePayPaymentRequest = {
  countryCode: 'US',
  currencyCode: 'USD',
  total: {
    label: 'Demo Shop',
    amount: '10.00'
  },
  supportedNetworks: ['visa', 'masterCard', 'amex'],
  merchantCapabilities: ['supports3DS']
}

const fetchMerchantSession = jest.fn().mockResolvedValue({})
const onPaymentAuthorized = jest.fn()
const onPaymentCancelled = jest.fn()
const onPaymentMethodSelected = jest.fn().mockResolvedValue({})
const onShippingMethodSelected = jest.fn().mockResolvedValue({})
const onShippingContactSelected = jest.fn().mockResolvedValue({})
const onCouponCodeChanged = jest.fn().mockResolvedValue({})

const VALIDATION_URL = 'https://apple-pay-gateway.apple.com/paymentservices/startSession'
const ERROR_MESSAGE = 'Something went wrong'

const setup = (props?: Partial<ApplePayButtonProps>) =>
  render(
    <ApplePayButton
      {...props}
      paymentRequest={paymentRequest}
      fetchMerchantSession={fetchMerchantSession}
      onPaymentAuthorized={onPaymentAuthorized}
      onPaymentCancelled={onPaymentCancelled}
      onPaymentMethodSelected={onPaymentMethodSelected}
      onShippingMethodSelected={onShippingMethodSelected}
      onShippingContactSelected={onShippingContactSelected}
      onCouponCodeChanged={onCouponCodeChanged}
    />
  )

const setupWithButtonClick = async () => {
  const { user } = setup()

  const button = await screen.findByTestId(APPLE_PAY_BUTTON_TEST_ID)
  await user.click(button)
}

const setupForError = async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  await setupWithButtonClick()

  const sessionInstance = mockApplePaySessionConstructor.mock.results[0].value

  return { sessionInstance, consoleErrorSpy }
}

describe('ApplePayButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Apple Pay is not available', () => {
    beforeEach(() => {
      mockCanMakePayments.mockReturnValue(false)
    })

    it('should not render the button', async () => {
      setup()

      await waitFor(() => {
        expect(screen.queryByTestId(APPLE_PAY_BUTTON_TEST_ID)).not.toBeInTheDocument()
      })
    })
  })

  describe('Apple Pay is available', () => {
    beforeEach(() => {
      mockCanMakePayments.mockReturnValue(true)
    })

    it('should render the button', async () => {
      setup()

      const button = await screen.findByTestId(APPLE_PAY_BUTTON_TEST_ID)
      expect(button).toBeVisible()
      expect(button).toHaveAttribute('buttonstyle', 'black')
      expect(button).toHaveAttribute('type', 'buy')
    })

    it('should render the button with button style props', async () => {
      setup({
        buttonStyle: 'white',
        type: 'tip'
      })

      const button = await screen.findByTestId(APPLE_PAY_BUTTON_TEST_ID)
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('buttonstyle', 'white')
      expect(button).toHaveAttribute('type', 'tip')
    })

    it('initiates Apple Pay session on button click', async () => {
      onPaymentAuthorized.mockResolvedValue({ status: globalObject.ApplePaySession.STATUS_SUCCESS })
      await setupWithButtonClick()

      expect(mockApplePaySessionConstructor).toHaveBeenCalledWith(3, paymentRequest)

      const sessionInstance = mockApplePaySessionConstructor.mock.results[0].value

      expect(sessionInstance.begin).toHaveBeenCalled()

      await sessionInstance.onvalidatemerchant({ validationURL: VALIDATION_URL })

      expect(fetchMerchantSession).toHaveBeenCalledWith(VALIDATION_URL)
      expect(sessionInstance.completeMerchantValidation).toHaveBeenCalledWith({})

      const payment = {} as ApplePayJS.ApplePayPayment
      await sessionInstance.onpaymentauthorized({ payment })

      expect(onPaymentAuthorized).toHaveBeenCalledWith(payment)
      expect(sessionInstance.completePayment).toHaveBeenCalledWith({
        status: globalObject.ApplePaySession.STATUS_SUCCESS
      })

      const paymentMethodEvent = {} as ApplePayJS.ApplePayPaymentMethodSelectedEvent
      await sessionInstance.onpaymentmethodselected(paymentMethodEvent)

      expect(onPaymentMethodSelected).toHaveBeenCalledWith(paymentMethodEvent)
      expect(sessionInstance.completePaymentMethodSelection).toHaveBeenCalledWith({})

      const shippingMethodEvent = {} as ApplePayJS.ApplePayShippingMethodSelectedEvent
      await sessionInstance.onshippingmethodselected(shippingMethodEvent)

      expect(onShippingMethodSelected).toHaveBeenCalledWith(shippingMethodEvent)
      expect(sessionInstance.completeShippingMethodSelection).toHaveBeenCalledWith({})

      const shippingContactEvent = {} as ApplePayJS.ApplePayShippingContactSelectedEvent
      await sessionInstance.onshippingcontactselected(shippingContactEvent)

      expect(onShippingContactSelected).toHaveBeenCalledWith(shippingContactEvent)
      expect(sessionInstance.completeShippingContactSelection).toHaveBeenCalledWith({})

      const couponCodeEvent = {} as ApplePayJS.ApplePayCouponCodeChangedEvent
      await sessionInstance.oncouponcodechanged(couponCodeEvent)

      expect(onCouponCodeChanged).toHaveBeenCalledWith(couponCodeEvent)
      expect(sessionInstance.completeCouponCodeChange).toHaveBeenCalledWith({})

      sessionInstance.oncancel()

      expect(onPaymentCancelled).toHaveBeenCalled()
    })

    describe('Error handlers', () => {
      beforeEach(() => {
        jest.restoreAllMocks()
      })

      it('handles error when loading Apple Pay SDK fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        jest.spyOn(document, 'querySelector').mockReturnValue(null)
        jest.spyOn(document.head, 'appendChild').mockImplementation(() => {
          throw new Error(ERROR_MESSAGE)
        })

        setup()

        await waitFor(() => {
          expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        })

        expect(screen.queryByTestId(APPLE_PAY_BUTTON_TEST_ID)).not.toBeInTheDocument()
      })

      it('handles error in checkApplePayAvailability', async () => {
        mockCanMakePayments.mockImplementation(() => {
          throw new Error(ERROR_MESSAGE)
        })
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        setup()

        await waitFor(() => {
          expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        })

        expect(screen.queryByTestId(APPLE_PAY_BUTTON_TEST_ID)).not.toBeInTheDocument()
      })

      it('handles error in fetchMerchantSession during merchant validation', async () => {
        fetchMerchantSession.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.onvalidatemerchant({
          validationURL: VALIDATION_URL
        })

        expect(fetchMerchantSession).toHaveBeenCalledWith(VALIDATION_URL)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(mockAbort).toHaveBeenCalledTimes(1)
      })

      it('handles error in onPaymentAuthorized', async () => {
        onPaymentAuthorized.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.onpaymentauthorized({ payment: {} as ApplePayJS.ApplePayPayment })

        expect(onPaymentAuthorized).toHaveBeenCalledTimes(1)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(sessionInstance.completePayment).toHaveBeenCalledWith({
          status: globalObject.ApplePaySession.STATUS_FAILURE
        })
      })

      it('handles error in onPaymentMethodSelected', async () => {
        onPaymentMethodSelected.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.onpaymentmethodselected({} as ApplePayJS.ApplePayPaymentMethodSelectedEvent)

        expect(onPaymentMethodSelected).toHaveBeenCalledTimes(1)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(mockAbort).toHaveBeenCalledTimes(1)
      })

      it('handles error in onShippingMethodSelected', async () => {
        onShippingMethodSelected.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.onshippingmethodselected({} as ApplePayJS.ApplePayShippingMethodSelectedEvent)

        expect(onShippingMethodSelected).toHaveBeenCalledTimes(1)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(mockAbort).toHaveBeenCalledTimes(1)
      })

      it('handles error in onShippingContactSelected', async () => {
        onShippingContactSelected.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.onshippingcontactselected({} as ApplePayJS.ApplePayShippingContactSelectedEvent)

        expect(onShippingContactSelected).toHaveBeenCalledTimes(1)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(mockAbort).toHaveBeenCalledTimes(1)
      })

      it('handles error in onCouponCodeChanged', async () => {
        onCouponCodeChanged.mockRejectedValue(new Error(ERROR_MESSAGE))

        const { sessionInstance, consoleErrorSpy } = await setupForError()

        await sessionInstance.oncouponcodechanged({} as ApplePayJS.ApplePayCouponCodeChangedEvent)

        expect(onCouponCodeChanged).toHaveBeenCalledTimes(1)
        expect(consoleErrorSpy.mock.calls).toEqual([[new Error(ERROR_MESSAGE)]])
        expect(mockAbort).toHaveBeenCalledTimes(1)
      })
    })
  })
})
