## Name: react-google-login

The package provides reusable Google Login and Logout components for React applications. It simplifies integrating Google Identity Services into your project with customizable configurations, handling login and logout flows.

## Usage

Install @dbbs/react-google-login into your application using Yarn.

```bash
yarn add @dbbs/react-google-login
```

## Examples
Import the GoogleLoginButton component and use it in your application to handle Google login:

```tsx
import { GoogleLoginButton } from '@dbbs/react-google-auth';

export default function App() {
  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const handleLoginError = (error) => {
    console.error('Login Error:', error);
  };

  return (
    <GoogleLoginButton
      clientId="YOUR_CLIENT_ID" // Replace with your Google OAuth client ID
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      buttonText="Sign in with Google"
      theme="filled_blue"
      size="large"
      shape="pill"
      autoSelect={true} // Optional: Automatically sign in previously selected accounts
    />
  );
}
```

Import the GoogleLogoutButton component and use it in your application to handle Google logout:

```tsx
import { GoogleLogoutButton } from '@dbbs/react-google-auth';

export default function App() {
  const handleLogoutSuccess = () => {
    console.log('Logout Success');
  };

  const handleLogoutError = (error) => {
    console.error('Logout Error:', error);
  };

  const handleRevokeSuccess = () => {
    console.log('Token successfully revoked.');
  };

  const handleRevokeError = (error) => {
    console.error('Token revocation failed:', error);
  };

  return (
    <GoogleLogoutButton
      onSuccess={handleLogoutSuccess}
      onError={handleLogoutError}
      onRevokeSuccess={handleRevokeSuccess}
      onRevokeError={handleRevokeError}
      buttonText="Logout"
      revokeAccess={true} // Whether to revoke tokens upon logout
    />
  );
}
```

## Features

- GoogleLoginButton provides an easy-to-use interface for Google login.
- GoogleLogoutButton handles logout flows and token revocation seamlessly.

## Feature Keywords

- google-login
- google-logout
- google-login-integration
- google-identity-services

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

[Google Identity Services API Documentation](https://developers.google.com/identity)

## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react
- @types/google-one-tap