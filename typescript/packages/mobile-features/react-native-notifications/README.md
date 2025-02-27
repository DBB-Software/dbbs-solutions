## Name: react-native-notifications

## Description

The `react-native-notifications` package provides notification functionalities for React Native applications, enabling seamless integration with notification services.

## Installation

Install the package using the following command:

```bash
yarn add @dbbs/mobile-react-native-notifications @notifee/react-native
```

## Usage

### Initialize Notification Handling

Use the `useRNPushNotificationNavigation` and `useRNCliDisplayNotification` hooks to handle notification navigation and display.

### Example

#### Using the Hooks in a Component

```tsx
import React from 'react'
import { View } from 'react-native'
import { useRNPushNotificationNavigation, useRNCliDisplayNotification } from '@dbbs/mobile-react-native-notifications'

const SomeComponent = () => {
  const navigateToContent = (metadata) => {
    // Handle navigation based on notification metadata
  }

  useRNPushNotificationNavigation({ navigateToContent })
  useRNCliDisplayNotification()

  return (
    <View>
      {/* Render your UI */}
    </View>
  )
}

export default SomeComponent
```

## Feature Keywords

- react-native-notifications
- notifications

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

[Notifee](https://notifee.app/)

## External dependencies

- @notifee/react-native
- @react-native-firebase/messaging
