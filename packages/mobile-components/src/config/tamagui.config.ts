import { createTamagui } from 'tamagui'
import { animations, exampleFont, media, themes, tokens } from '../core'

export const config = createTamagui({
  themes,
  tokens,
  animations,
  // `@tamagui/core` doesn't provide media query capabilities out of the box
  // for native as it is de-coupled from react-native.
  media,
  fonts: {
    exampleFont
  },
  // add custom shorthand props
  // note: as const is important, without it you may see breaking types
  shorthands: {
    px: 'paddingHorizontal',
    f: 'flex',
    w: 'width'
  } as const,

  // Experimental / advanced, only for overriding the core component styles
  // Prefer to use styled() for building your own, only useful for edge cases.
  defaultProps: {
    Text: {
      // override any default props here
    }
  }
})
