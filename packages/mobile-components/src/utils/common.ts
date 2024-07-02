export const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

export const isPositiveNumber = (number: number) => {
  return typeof number === 'number' && number > 0
}
