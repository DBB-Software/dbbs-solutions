## Name: firebase

## Description

The `firebase` package provides Firebase functionalities for React Native applications, enabling seamless integration with Firebase services. This package includes support for Firebase Remote Config and Cloud Messaging.

## Usage

Install the package using the following yarn command.

```bash
yarn add @dbbs/mobile-firebase
```

### Components
Presented as a `firebase-components` package that provides UI solutions for Firebase services in `react-native` applications.

### Features
Presented as a `firebase-features` package that provides universal solutions for handling Firebase services in `react-native` apps.

### Remote Config
The `RemoteConfigProvider` component allows you to fetch and activate remote configuration values from Firebase. It provides a context that can be used to access these values throughout your application.

#### Example Usage
```tsx
import React from 'react'
import { View, Text } from 'react-native'
import { RemoteConfigProvider, useRemoteConfig } from '@dbbs/mobile-firebase'

const initialRemoteConfigValues = {
  test: 'default',
  testNumber: 0,
  testObject: { key: 'value' }
}

const App = () => (
  <RemoteConfigProvider initialValues={initialRemoteConfigValues}>
    <YourComponent />
  </RemoteConfigProvider>
)

const YourComponent = () => {
  const { test, testNumber, testObject } = useRemoteConfig()

  return (
    <View>
      <Text>{test?.value}</Text>
      <Text>{testNumber?.value}</Text>
      <Text>{testObject?.value?.key}</Text>
    </View>
  )
}
```

### Cloud Messaging
The `PushNotificationsProvider` component allows you to manage push notifications using Firebase Cloud Messaging. It provides a context that can be used to subscribe, unsubscribe, and refresh tokens for push notifications.

#### Example Usage
```tsx
import React from 'react'
import { View, Text } from 'react-native'
import { PushNotificationsProvider } from '@dbbs/mobile-firebase'

const App = () => (
  <PushNotificationsProvider>
    <YourComponent />
  </PushNotificationsProvider>
)

const YourComponent = () => {
  // Your push notification logic here
  return (
    <View>
      <Text>Push Notifications</Text>
    </View>
  )
}
```

### IOS
To work with iOS in a React Native app, you need to configure the app for Firebase in the Firebase Console and install necessary dependencies.

### Android
To work with Android in a React Native app, you need to configure the app for Firebase in the Firebase Console and install necessary dependencies.

## Feature Keywords

- firebase
- react-native-firebase

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

[React Native Firebase](https://rnfirebase.io/)

## External dependencies

- @react-native-firebase/app
- @react-native-firebase/remote-config
- @react-native-firebase/messaging
