import { clamp, isPositiveNumber } from '../../src'

describe('clamp', () => {
  const testData = [
    { val: 5, min: 1, max: 10, expected: 5 },
    { val: 0, min: 1, max: 10, expected: 1 },
    { val: 15, min: 1, max: 10, expected: 10 },
    { val: -5, min: -10, max: -1, expected: -5 },
    { val: 0, min: 5, max: 5, expected: 5 },
    { val: 10, min: 5, max: 5, expected: 5 }
  ]

  test.each(testData)(
    'returns $expected when val is $val, min is $min, and max is $max',
    ({ val, min, max, expected }) => {
      expect(clamp(val, min, max)).toBe(expected)
    }
  )
})

describe('isPositiveNumber', () => {
  const testData = [
    { number: 1, expected: true },
    { number: 100, expected: true },
    { number: 0.1, expected: true },
    { number: 0, expected: false },
    { number: -1, expected: false },
    { number: -100, expected: false },
    { number: -0.1, expected: false }
  ]

  test.each(testData)('returns $expected when number is $number', ({ number, expected }) => {
    expect(isPositiveNumber(number)).toBe(expected)
  })
})
