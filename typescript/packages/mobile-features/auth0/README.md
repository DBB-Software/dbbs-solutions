## Name: auth0

## Description

The `auth0` package provides authentication functionalities for React Native applications, enabling seamless integration with Auth0 services.

## Usage

Install the package using the following npm command.

```bash
yarn add @dbbs/mobile-auth0
```

### Components

#### AuthGuard

The `AuthGuard` component wraps your application with Auth0 authentication context. It ensures that the user is authenticated before accessing the protected content.

**Props:**
- `domain`: The Auth0 domain.
- `clientId`: The Auth0 client ID.
- `loadingComponent`: (Optional) A React element to display while authentication is in progress.
- `fallback`: A React element to display if the user is not authenticated.
- `children`: The protected content to render if the user is authenticated.

**Example:**
```tsx
import React from 'react'
import { AuthGuard } from '@dbbs/mobile-auth0'

const App = () => (
  <AuthGuard
    domain="your-auth0-domain"
    clientId="your-auth0-client-id"
    loadingComponent={<Loading />}
    fallback={<Login />}
  >
    <ProtectedAppContent />
  </AuthGuard>
)
```

#### ProtectedContent

The `ProtectedContent` component is used internally by `AuthGuard` to manage the display of content based on the authentication state.

**Props:**
- `loadingComponent`: (Optional) A React element to display while authentication is in progress.
- `fallback`: A React element to display if the user is not authenticated.
- `children`: The protected content to render if the user is authenticated.

### Features

The `auth0-features` package provides universal solutions for handling authentication in `react-native` apps. It includes components like `AuthGuard` and `ProtectedContent` to simplify the integration of Auth0 authentication.

### IOS
To work with iOS in a React Native app, you need to configure the app for Auth0 in the Auth0 Dashboard and install necessary dependencies.

### Android
To work with Android in a React Native app, you need to configure the app for Auth0 in the Auth0 Dashboard and install necessary dependencies.

## Feature Keywords

- auth0
- authentication

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

[React Native Auth0](https://github.com/auth0/react-native-auth0)

## External dependencies

- react-native-auth0
