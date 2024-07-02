## Name: mobile-components

## Description

The mobile-components package offers a set of wrappers and tools for implementing mobile application design.

## Usage

Install `@dbbs/mobile-components` into your application using yarn.

```bash
yarn add @dbbs/mobile-components
```

## Examples

Import the tools from mobile-components package and call with appropriate parameters to utilize them in your application.

For example PaperProvider may be used as a wrapper in the App file. As input parameter `theme` should be provided.

```tsx
import React from 'react'
import { PaperProvider, appTheme } from '@dbbs/mobile-components'

export const App = () => (
  <PaperProvider theme={appTheme}>
    // ...
  </PaperProvider>
)
```

## Features

- The Theme Provider offers default application theme configuration (colors, styles, etc.) sourced from the react-native-paper package. It also provides the flexibility to customize the default theme for specific projects.

## Feature Keywords

- mobile-theme-provider

## Language and framework

- React Native
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Mobile-app
- Design

## Domain Category

- Common

## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- xomastyleee
- RomanBobrovskiy

## Links

[React Native Paper](https://reactnativepaper.com/)

## Relations

- /apps/mobile-app

## External dependencies

- react-native-paper
- react-native-vector-icons
