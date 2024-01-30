import { createSoftenMask, createThemeBuilder } from '@tamagui/theme-builder'

// Provide a required default context from theme Builder
const themesBuilder = createThemeBuilder()
  .addPalettes({
    dark: ['#000'],
    light: ['#fff']
  })
  .addTemplates({
    base: {
      background: 0,
      color: -0
    }
  })
  .addMasks({
    soften: createSoftenMask()
  })
  .addThemes({
    light: {
      template: 'base',
      palette: 'light'
    },
    dark: {
      template: 'base',
      palette: 'dark'
    }
  })

export const themes = themesBuilder.build()
