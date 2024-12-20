## Name: react-apple-pay

The package provides a reusable Apple Pay integration component for React applications. It simplifies the process of implementing Apple Pay with customizable configurations for merchants, transactions, and payment methods.

## Usage

Install `@dbbs/react-apple-pay` into your application using Yarn.

```bash
yarn add @dbbs/react-apple-pay
```

## Examples
Import the ApplePayButton component and use it in your application by providing the necessary parameters such as merchantInfo, transactionInfo, and success/error handlers.

```tsx
import ApplePayButton from './ApplePayButton';

export default function App() {
  return (
    <ApplePayButton
      paymentRequest={{
        countryCode: 'US',
        currencyCode: 'USD',
        total: {
          label: 'Example Merchant', // Display name of the merchant
          amount: '50.00',
        },
        supportedNetworks: ['visa', 'masterCard', 'amex'], // Supported card networks
        merchantCapabilities: ['supports3DS'], // Merchant capabilities
      }}
      fetchMerchantSession={(validationURL) =>
        // Fetch the merchant session from your server
        fetch('/api/validate-merchant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ validationURL }),
        }).then((response) => response.json())
      }
      onPaymentAuthorized={(payment) =>
        // Handle the payment authorization
        fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payment),
        })
          .then(() => ({
            status: ApplePaySession.STATUS_SUCCESS,
          }))
          .catch(() => ({
            status: ApplePaySession.STATUS_FAILURE,
          }))
      }
      onPaymentCancelled={() => console.log('Payment was cancelled')}
      buttonStyle="black"
      type="buy"
    />
  );
}

```
## Features

- ApplePayButton provides an easy-to-use interface for Apple Pay integration. Customize merchant details, transaction information, and payment methods with minimal configuration.

## Feature Keywords

- apple-pay-integration
- online-payment

## Language and framework

- React
- TypeScript

## Type

- Package

## Tech Category

- Front-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- Rodion Chubakha

## Links

[Apple Pay Webb Documentation](https://developer.apple.com/documentation/apple_pay_on_the_web)
[Apple Pay Button Demo](https://applepaydemo.apple.com/)
## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react