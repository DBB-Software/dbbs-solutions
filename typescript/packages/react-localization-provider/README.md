## Name: react-localization-provider

## Description

The `react-localization-provider` package provides localization utilities for both React Native and web React applications using i18next.

## Installation

Install the package using the following command:

```bash
yarn add @dbbs/react-localization-provider
```

## Usage

### Initialize Localization Service

Use the `initLocaleService` function to initialize the localization service with your language resources.

### Example

#### Initializing Localization

```typescript
import { initLocaleService } from '@dbbs/react-localization-provider'

const resources = {
  en: {
    welcome: "Welcome"
  },
  fr: {
    welcome: "Bienvenue"
  }
}

initLocaleService({
  resources,
  defaultLanguage: 'en'
})
```

## Feature Keywords

- react-localization-provider
- localization
- i18next

## Language and framework

- React Native
- React
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Mobile-app
- Web-app

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy
- xomastyleee

## Links

[i18next](https://www.i18next.com/)

## External dependencies

- i18next
- react-i18next
