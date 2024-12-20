## Name: react-google-pay

The package provides a reusable Google Pay integration component for React applications. It simplifies the process of implementing Google Pay with customizable configurations for merchants, transactions, and payment methods.

## Usage

Install `@dbbs/react-google-pay` into your application using Yarn.

```bash
yarn add @dbbs/react-google-pay
```

## Examples
Import the GooglePayButton component and use it in your application by providing the necessary parameters such as merchantInfo, transactionInfo, and success/error handlers.

```tsx
import { GooglePayButton } from '@dbbs/react-google-pay';

export default function App() {
  return (
    <GooglePayButton
      paymentRequest={{
        merchantInfo: {
          merchantName: 'Example Merchant', // The display name of the merchant (e.g., your company or store name) that appears in the payment sheet.
          merchantId: '123456789', // Unique identifier assigned by the payment processor
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL', // Indicates that the total price is fixed and final
          totalPrice: '50.00',
          currencyCode: 'USD',
        },
        allowedPaymentMethods: [], // Specify the payment methods supported (e.g., cards, wallets)
      }}
      environment="TEST" // Use "TEST" for sandbox mode or "PRODUCTION" for live transactions
      buttonColor="black"
      buttonType="short"
      onLoadPaymentData={(data) => console.log('Payment Success:', data)}
      onError={(error) => console.error('Payment Error:', error)}
    />
  );
}
```
## Features

- GooglePayButton provides an easy-to-use interface for Google Pay integration. Customize merchant details, transaction information, and payment methods with minimal configuration.

## Feature Keywords

- google-pay-integration
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

- Rostyslav Zahorulko

## Links

[Google Pay API Documentation](https://developers.google.com/pay/api)

## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react
- @google-pay/button-react
