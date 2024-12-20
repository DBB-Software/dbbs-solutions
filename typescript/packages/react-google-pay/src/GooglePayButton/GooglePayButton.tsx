import { FC, ComponentProps } from 'react'
import GooglePayButtonReact from '@google-pay/button-react'
import { DEFAULT_API_VERSION, DEFAULT_API_VERSION_MINOR } from './constants'

type GooglePayButtonReactProps = ComponentProps<typeof GooglePayButtonReact>

export interface GooglePayButtonProps extends Omit<GooglePayButtonReactProps, 'paymentRequest' | 'environment'> {
  paymentRequest: Omit<google.payments.api.PaymentDataRequest, 'apiVersion' | 'apiVersionMinor'> &
    Partial<Pick<google.payments.api.PaymentDataRequest, 'apiVersion' | 'apiVersionMinor'>>
  environment?: GooglePayButtonReactProps['environment']
}

const GooglePayButton: FC<GooglePayButtonProps> = ({
  paymentRequest,
  buttonColor = 'default',
  buttonType = 'long',
  environment = 'PRODUCTION',
  onLoadPaymentData,
  onError,
  ...restProps
}) => (
  <GooglePayButtonReact
    environment={environment}
    paymentRequest={{
      ...paymentRequest,
      apiVersion: paymentRequest.apiVersion ?? DEFAULT_API_VERSION,
      apiVersionMinor: paymentRequest.apiVersionMinor ?? DEFAULT_API_VERSION_MINOR
    }}
    onLoadPaymentData={onLoadPaymentData}
    onError={onError}
    buttonColor={buttonColor}
    buttonType={buttonType}
    {...restProps}
  />
)

export default GooglePayButton
