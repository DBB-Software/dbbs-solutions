export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

export const isPositiveNumber = (number: number) => typeof number === 'number' && number > 0
