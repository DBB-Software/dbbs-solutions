import { getConfigValueOrThrow } from "../../src/utils/getConfigValueOrThrow"

describe('getConfigValueOrThrow', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('should return the value if present in process.env', () => {
    process.env.TEST_KEY = 'test-value'
    expect(getConfigValueOrThrow('TEST_KEY')).toBe('test-value')
  })

  it('should throw if the value is undefined', () => {
    expect(() => getConfigValueOrThrow('NOT_PRESENT')).toThrow('No NOT_PRESENT variable provided')
  })
})