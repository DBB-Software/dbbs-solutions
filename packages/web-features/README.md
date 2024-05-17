## Name: web-features

## Description

The package includes a set of web features that may be simply integrated into the web application.

## Usage

Install `@dbbs/web-features` into your application using yarn.

```bash
yarn add @dbbs/web-features
```

## Examples

Import the web feature to utilize it in your application and call with appropriate parameters.

For example AuthGuard may be used as a wrapper in the App file. As input parameters `domain`, `clientId` and `authorizationParams` should be provided.

```tsx
import { AuthGuard } from '@dbbs/web-features'

export default function App() {
  return (
    <AuthGuard
      domain={process.env.AUTH0_DOMAIN}
      clientId={process.env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/home`,
        audience: process.env.AUTH0_AUDIENCE
      }}
    >
      // ...
    </AuthGuard>
  )
}
```

## Features

- AuthGuard is a wrapper that provides custom implementation of Auth0 integration. Under the hood, `ProtectedContent` HOC waiting for the authorization process, showing `LoadingComponet` on the web page until token is validated.  

## Feature Keywords

- auth0-integration

## Language and framework

- React
- Next.js
- TypeScript

## Type

- Package

## Tech Category

- Front-end

## Domain Category

- Common

## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy

## Links

[Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)

## Relations

- /apps/web-spa
- /apps/web-ssr

## External dependencies

- react
- @auth0/auth0-react
