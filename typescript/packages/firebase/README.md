## Name: firebsae

## Description

The firebase package contains basic tools to work with firebase services.

## Usage

Install `@dbbs/firebase` into your application.

```bash
yarn add @dbbs/firebase
```

## Examples

Use tool to initialize firebase application.
```ts
import { initializeApp, type FirebaseOptions } from '@dbbs/firebase/app'

const options: FirebaseOptions = {}

const app = initializeApp(firebaseOptions)
```

Use tool to initialize firebase admin application.
```ts
import { initializeApp, type AppOptions } from '@dbbs/firebase/admin'

const options: AppOptions = {}

const adminApp = initializeApp(AppOptions)
```

## Features

- Initialize firebase client application
- Initialize firebase admin application
- Firebase authorization
- Firebase analytics
- Firestore

## Feature keywords

- firebase-app
- firebase-admin-app
- firebase-auth
- firebase-admin-auth
- firebase-firestore
- firebase-analytics

## Language and framework

- TypesScript
- JavaScript

## Type

- Package

## Tech Category

- Common
- Back-end
- Front-end
- Mobile

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy

## External dependencies

- firebase
- firebase-admin
