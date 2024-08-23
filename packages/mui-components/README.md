## Name: mui-components

## Description

The mui-components package offers a set of wrappers and tools for implementing web application design (SSR and SPA). These wrappers include utilities for Emotion styles and Material-UI components, allowing their usage in applications without direct dependencies on them. The lazyLoadImages function accepts an HTML element containing an array of images and loads only those images that are visible on the portion of the page displayed on the user's screen.

## Usage

Install `@dbbs/mui-components` into your application using yarn.

```bash
yarn add @dbbs/mui-components
```

## Examples

Import the tools from mui-components package and call with appropriate parameters to utilize them in your application.

For example ThemeProvider may be used as a wrapper in the App file. As input parameter `theme` should be provided.

```tsx
import { ThemeProvider, Typography, theme } from '@dbbs/mui-components'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Typography data-testid="app-title">Sample APP</Typography>
    </ThemeProvider>
  )
}
```

## Features

- Wrappers for Emotion styles and Material-UI components, allowing their usage in applications without direct dependencies on them.
- The lazyLoadImages function accepts an HTML element containing an array of images and loads only those images that are visible on the portion of the page displayed on the user's screen.

## Feature Keywords

- mui-components-wrapper
- emotion-styles-wrapper
- lazy-load-images

## Language and framework

- React
- Next.js
- TypeScript

## Type

- Package

## Tech Category

- Front-end
- Design

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy

## Links

[Emotion. Introduction.](https://emotion.sh/docs/introduction)

[MUI: The React component library you always wanted](https://mui.com/)

## Relations

- /apps/web-spa
- /apps/web-ssr

## External dependencies

- @emotion/cache
- @emotion/react
- @emotion/styled
- @mui/material
- @mui/styled-engine
- @mui/system
