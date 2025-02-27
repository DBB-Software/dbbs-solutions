import { PaletteOptions, alpha, createTheme } from '@dbbs/mui-components'

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme {}
  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions {}

  interface PaletteColor {
    hover: string
    selected: string
    focus: string
    enabled: string
    background: string
  }

  interface SimplePaletteColorOptions {
    hover: string
    selected: string
    focus: string
    enabled: string
    background: string
  }
}

const textPrimary = '#1E2930'
const primaryMain = '#1F1740'
const secondaryMain = '#7D47FC'
const errorMain = '#D52C00'
const successMain = '#0A810B'
const warningMain = '#EBAC17'
const infoMain = '#007C79'
const white = '#FFFFFF'

function createPaletteOptions(): PaletteOptions {
  return {
    mode: 'light',
    text: {
      primary: textPrimary,
      secondary: '#5E696F',
      disabled: '#9AA3A9'
    },
    primary: {
      main: primaryMain,
      light: secondaryMain,
      dark: '#000',
      contrastText: white,
      hover: alpha(primaryMain, 0.04),
      selected: alpha(primaryMain, 0.08),
      focus: alpha(primaryMain, 0.3),
      enabled: alpha(primaryMain, 0.5),
      background: alpha(primaryMain, 0.1)
    },
    secondary: {
      main: secondaryMain,
      light: '#E2DDEE',
      dark: '#73639B',
      contrastText: white,
      hover: alpha(secondaryMain, 0.04),
      selected: alpha(secondaryMain, 0.08),
      focus: alpha(secondaryMain, 0.3),
      enabled: alpha(secondaryMain, 0.5),
      background: alpha(secondaryMain, 0.1)
    },
    common: {
      black: '#1D1D1D',
      white
    },
    error: {
      main: errorMain,
      light: '#FF9E84',
      dark: '#BE2800',
      contrastText: white,
      hover: alpha(errorMain, 0.04),
      selected: alpha(errorMain, 0.08),
      focus: alpha(errorMain, 0.3),
      enabled: alpha(errorMain, 0.5),
      background: alpha(errorMain, 0.1)
    },
    success: {
      main: successMain,
      light: '#6AE79C',
      dark: '#1AA251',
      contrastText: '#fff',
      hover: alpha(successMain, 0.04),
      selected: alpha(successMain, 0.08),
      focus: alpha(successMain, 0.3),
      enabled: alpha(successMain, 0.5),
      background: '#E5F2F2'
    },
    warning: {
      main: warningMain,
      light: '#FFEAB9',
      dark: '#8F690C',
      hover: alpha(warningMain, 0.04),
      selected: alpha(warningMain, 0.08),
      focus: alpha(warningMain, 0.3),
      enabled: alpha(warningMain, 0.5),
      background: alpha(warningMain, 0.1)
    },
    info: {
      main: infoMain,
      light: '#00CCC7',
      dark: '#006F6C',
      contrastText: white,
      hover: alpha(infoMain, 0.04),
      selected: alpha(infoMain, 0.08),
      focus: alpha(infoMain, 0.3),
      enabled: alpha(infoMain, 0.5),
      background: '#E5F2F2'
    }
  }
}

const theme = createTheme({
  palette: createPaletteOptions()
})

export default theme
