## Name: @dbbs/mobile-expo-notifications

## Description

The `@dbbs/mobile-expo-notifications` package provides notification functionalities for Expo applications, enabling seamless integration with Expo's notification services. It supports both foreground and background notifications, handling user interactions, and displaying notifications.

## Installation

Install the package using the following npm command.

```bash
yarn add @dbbs/mobile-expo-notifications expo-notifications
```

## Usage

### Setting Up Notifications

To use notifications in your Expo app, you need to configure your app for notifications and request the necessary permissions.

```typescript
import React, { useEffect } from 'react'
import { handleExpoPushNotification, useExpoDisplayNotification } from '@dbbs/mobile-expo-notifications'
import { setNotificationHandler } from 'expo-notifications'
import messaging from '@react-native-firebase/messaging'

const fcm = messaging()
fcm.setBackgroundMessageHandler(handleExpoPushNotification)
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export const App = () => {
  useExpoDisplayNotification()
  return (
    <PushNotificationsProvider>
      ...
    </PushNotificationsProvider>
  )
}
```

### Handling Notifications

Use the provided hooks to handle notifications in your app.

#### useExpoPushNotificationNavigation

This hook listens for incoming notifications and navigates to the appropriate screen based on the notification metadata.

```typescript
import { useExpoPushNotificationNavigation } from '@dbbs/mobile-expo-notifications'

const navigateToContent = (metadata) => {
  // Implement your navigation logic here
}

useExpoPushNotificationNavigation({ navigateToContent })
```

#### useExpoDisplayNotification

This hook listens for incoming messages and displays notifications.

```typescript
import { useExpoDisplayNotification } from '@dbbs/mobile-expo-notifications'

useExpoDisplayNotification()
```

### Components
Presented as a `expo-notifications-components` package that provides UI solutions for notifications in `expo` applications.

### Features
Presented as a `expo-notifications-features` package that provides universal solutions for handling notifications in `expo` apps.

### IOS
To work with iOS in an Expo app, you need to configure the app for notifications in the Apple Developer portal and install necessary dependencies.

### Android
To work with Android in an Expo app, you need to configure the app for notifications in the Google Play Console and install necessary dependencies.

## Feature Keywords

- expo-notifications
- notifications

## Language and framework

- Expo
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

[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

## External dependencies

- expo-notifications
