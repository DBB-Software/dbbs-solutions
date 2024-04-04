// this is required for NextJS, since MUI works only in client side mode.
// https://mui.com/material-ui/guides/next-js-app-router/

'use client'

export * from '@mui/material'

// styles
export { theme } from './theme'
export { styled, styledComponent } from './styles/styled'
export { StyledEngineProvider } from './styles/StyledEngineProvider'
export { createTheme } from './styles/createTheme'
export * as colorManipulator from './styles/colorManipulator'
export { createCache } from './styles/createCache'
export { CacheProvider } from './styles/reactTools'
export { useTheme } from './styles/useTheme'
export { useMediaQuery } from './styles/useMediaQuery'
export { withTheme } from './styles/withTheme'

// system
export { type SxProps } from './system/SxProps'
export { borders } from './system/borders'
export { display } from './system/display'
export { flexbox } from './system/flexbox'
export { positions } from './system/positions'
export { shadows } from './system/shadows'
export { sizing } from './system/sizing'
export { spacing } from './system/spacing'
export { type SystemCssProperties } from './system/SystemCssProperties'
export { default as systemStyled } from './system/styled'
export { ThemeProvider } from './system/ThemeProvider'

// utils
export { default as lazyLoadImages } from './utils/lazyLoadImages'
export { makeSxStyles } from './utils/makeSxStyles'
