## Name: react-microsoft-login

The package provides a MicrosoftAuthProvider provider component alongside with useAuth hook for React applications. It simplifies the process of implementing Microsoft Authorization with customizable configurations for Authentication mechanism.

## Usage

Install `@dbbs/react-microsoft-login` into your application using Yarn.

```bash
yarn add @dbbs/react-microsoft-login
```

## Examples
Import the MicrosoftAuthProvider provider component and use it in the root of your application by providing the necessary parameter - config.
List of all configuration options can be found in msal-browser's official github page  - https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 

```tsx
import { MicrosoftAuthProvider, MicrosoftAuthConfiguration } from '@dbbs/react-microsoft-login'

import './index.css'
import { Routes } from './Routes'

export const config: MicrosoftAuthConfiguration = {
  auth: {
    clientId: '<application_client_id>', // Generate real client ID using the official Microsoft documentation - https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: '/',
    postLogoutRedirectUri: '/'
  },
  system: {
    allowNativeBroker: false
  }
}

function App() {
  return (
    <div>
      <MicrosoftAuthProvider config={config}>
        <Routes />
      </MicrosoftAuthProvider>
    </div>
  )
}

export default App
```

After adding MicrosoftAuthProvider you can now use useAuth hook to access authentication logic.
useAuth returns object with next properties
- isAuthenticated - boolean variable that tells if user is authenticated
- signInPopup - function to sign in with popup
- signInRedirect - function to sign in with redirect
- signOutPopup - function to sign out with popup
- signOutRedirect - function to sign out with popup
- account - Account object with all common account redirect

Login Request, difference between redirect and poput, and overall usage is the same as for msal-browser library
You can find more in official github page - https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md

```tsx
import { useAuth, MicrosoftLoginRequest } from '@dbbs/react-microsoft-login'

export const loginRequest: MicrosoftLoginRequest = {
  scopes: ['User.Read']
}

export const CustomComponent = () => {
  const { signInPopup, account } = useAuth(loginRequest)

  console.log('Account Information: ', account)

  return <button onClick={signInPopup}>Sample APP</button>
}
```

## Features

- MicrosoftAuthProvider with useAuth provides an easy-to-use interface for Microsoft Login integration. Customize configuration and login request with minimal implementation.

## Feature Keywords

- microsoft-login-integration
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

[Single-page application: Microsoft App registration](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration)
[Microsoft Authentication Library for Javascript ](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)
[Microsoft Authentication Library Config Options ](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md)
## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react