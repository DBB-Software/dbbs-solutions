## Name: mobile-iap

## Description

The `mobile-iap` package provides in-app purchase functionalities for React Native applications, enabling seamless integration with app stores for monetization.

## Installation

Install the package using the following command:

```bash
yarn add @dbbs/mobile-iap react-native-iap
```

## Usage

### Initialize IAP Connection

Use the `useInitializeIAPConnection` hook to initialize the IAP connection when your app starts.

### Provide IAP Context

Wrap your components that need access to the IAP context using `MobilePaymentProvider` or `withMobilePaymentContext`.

### Use Mobile Payments Hook

Use the `useMobilePayments` hook to interact with the IAP functionalities such as fetching products and subscriptions, and handling purchase events.

### Example

#### Wrapping Your App with the Provider

```tsx
import React from 'react'
import { MobilePaymentProvider } from '@dbbs/mobile-iap'

const App = () => {
  return (
    <MobilePaymentProvider>
      {/* Your app components */}
    </MobilePaymentProvider>
  )
}

export default App
```

#### Using the Hook in a Component

```tsx
import React from 'react'
import { View } from 'react-native'
import { useMobilePayments } from '@dbbs/mobile-iap'

const SomeComponent = () => {
  const { products, subscriptions, currentPurchase, currentPurchaseError } = useMobilePayments({
    productSkus: ['product1', 'product2'],
    subscriptionSkus: ['subscription1']
  })

  // Handle products, subscriptions, purchases, and errors here

  return (
    <View>
      {/* Render your UI */}
    </View>
  )
}

export default SomeComponent
```

## Setting Up Google Pay / Apple Pay Products

To set up Google Pay and Apple Pay products, follow these steps:

### Google Pay

1. **Create a Payments Profile**:
   - Go to the [Google Play Console](https://play.google.com/console).
   - Navigate to "Settings" > "Payments profile" and create a new profile if you don't have one.

2. **Configure In-App Products**:
   - In the Google Play Console, select your app.
   - Go to "Monetize" > "Products" > "In-app products".
   - Click "Create product" and fill in the necessary details such as Product ID, Name, and Description.
   - Set the price and save the product.

3. **Configure Subscriptions**:
   - In the Google Play Console, select your app.
   - Go to "Monetize" > "Products" > "Subscriptions".
   - Click "Create subscription" and fill in the necessary details such as Subscription ID, Name, and Description.
   - Set the price and billing period, then save the subscription.

4. **Testing**:
   - Set up license testers in the Google Play Console under "Settings" > "License testing".
   - Add the email addresses of the testers.

For more details, refer to the [Google Play In-App Billing documentation](https://developer.android.com/google/play/billing).

### Apple Pay

1. **Configure In-App Products**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/).
   - Select "My Apps" and choose your app.
   - Go to the "Features" tab and select "In-App Purchases".
   - Click the "+" button to add a new in-app purchase.
   - Choose the type of in-app purchase (Consumable, Non-Consumable, Auto-Renewable Subscription, etc.).
   - Fill in the necessary details such as Reference Name, Product ID, and Pricing.

2. **Configure Subscriptions**:
   - In the "In-App Purchases" section, click the "+" button and select "Auto-Renewable Subscription".
   - Fill in the necessary details such as Reference Name, Product ID, and Pricing.
   - Set up subscription groups and durations.

3. **Testing**:
   - Use [Sandbox Tester Accounts](https://developer.apple.com/apple-pay/sandbox-testing/) to test in-app purchases.
   - Create sandbox tester accounts in App Store Connect under "Users and Access" > "Sandbox Testers".

For more details, refer to the [Apple In-App Purchase documentation](https://developer.apple.com/in-app-purchase/).

## Configuring for Test Transactions and Release

### Test Transactions

1. For Google Play, use the [Google Play Console](https://play.google.com/console) to set up license testers.
2. For Apple, use [Sandbox Tester Accounts](https://developer.apple.com/apple-pay/sandbox-testing/) to test in-app purchases.

### Release

1. Ensure all in-app products are correctly configured and approved in the respective app stores.
2. Follow the [Google Play In-App Billing documentation](https://developer.android.com/google/play/billing) and [Apple In-App Purchase documentation](https://developer.apple.com/in-app-purchase/) for release guidelines.

## Adding Capabilities in Xcode

To enable in-app purchases in your iOS app, you need to add the In-App Purchase capability in Xcode:

1. Open your project in Xcode.
2. Select your project in the Project Navigator.
3. Select your app target.
4. Go to the "Signing & Capabilities" tab.
5. Click the "+" button to add a new capability.
6. Select "In-App Purchase" from the list.

For more details, refer to the [official Apple documentation](https://developer.apple.com/documentation/storekit/in-app_purchase/setting_up_in-app_purchase).

## Feature Keywords

- mobile-iap
- in-app-purchase

## Language and framework

- React Native
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Mobile-app

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy
- xomastyleee

## Links

[React Native IAP](https://github.com/dooboolab/react-native-iap)

## External dependencies

- @react-native-iap
