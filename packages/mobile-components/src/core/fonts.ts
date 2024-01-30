import { createFont } from 'tamagui'

export const exampleFont = createFont({
  family: '',
  size: {}
  // keys used for the objects you pass to `size`, `lineHeight`, `weight`
  // and `letterSpacing` should be consistent. The `createFont` function
  // will fill-in any missing values if `lineHeight`, `weight` or `letterSpacing`
  // are subsets of `size`
})
