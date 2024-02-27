import { DefaultTheme } from 'react-native-paper'

export const appTheme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors
  }
}
