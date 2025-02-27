## Name: react-stripe

A package providing convenient React components and hooks for integrating Stripe Payments. It encapsulates the official @stripe/react-stripe-js and @stripe/stripe-js libraries to simplify implementation of Stripe-based payment forms and embedded checkouts

## Usage

Install `@dbbs/react-stripe` into your application using Yarn.

```bash
yarn add @dbbs/react-stripe
```

## Examples

Below are basic usage examples for two key components: StripeEmbeddedCheckout and StripePaymentElement. Both examples assume you have a valid Stripe public key and client secret.

### StripeEmbeddedCheckout

This component provides an embedded checkout experience using Stripe’s EmbeddedCheckout functionality. It helps you deliver a simplified checkout flow in your application.

```tsx
import React from 'react'
import { StripeEmbeddedCheckout, StripeEmbeddedCheckoutProps } from '@dbbs/react-stripe'

const embeddedOptions: StripeEmbeddedCheckoutProps['options'] = {
  clientSecret: '<client_secret>',
  // ...other configuration as needed
}

export const CheckoutPage = () => {
  return (
    <StripeEmbeddedCheckout
      stripePublicKey="<stripe_public_key>"
      options={embeddedOptions}
      className="custom-classname"
      id="custom-id"
    />
  )
}
```

### StripePaymentElement

This component combines Elements and PaymentElement to help you create custom payment forms. You can pass various configuration options like appearance, confirmParams that will be used during payment confirmation, and also control how loading appears to the user with the loader prop.

```tsx
import React from 'react'
import { StripePaymentElement, StripePaymentElementProps } from '@dbbs/react-stripe'

const paymentElementProps: StripePaymentElementProps = {
  stripePublicKey: '<stripe_public_key>',
  clientSecret: '<client_secret>',
  appearance: { theme: 'stripe' },
  loader: 'auto',
  confirmParams={{
    return_url: 'https://example.com'
    // ...other configuration as needed
  }}
}

export const PaymentPage = () => {
  return (
    <StripePaymentElement {...paymentElementProps}>
      <button>Pay Now</button>
    </StripePaymentElement>
  )
}
```

## Features

- StripeEmbeddedCheckout for integrating Stripe's Embedded Checkout.
- StripePaymentElement for creating custom payment forms with minimal setup.

## Feature Keywords

- stripe-integration
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

- [Stripe React integration](https://stripe.com/docs/stripe-js/react)
- [Stripe docs](https://stripe.com/docs)
## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react
- @stripe/react-stripe-js
- @stripe/stripe-js