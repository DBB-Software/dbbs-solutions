import { createTokens } from 'tamagui'

// for tamagui, it expects you to define a true token
// that maps to your default size,
// this way it knows what token to use by default.
// So you'd do something like this
export const tokens = createTokens({
  radius: {
    true: 1
  },
  zIndex: {
    true: 1
  },
  color: {
    true: 1
  },
  space: {
    true: 1
  },
  size: {
    true: 1
  }
})
