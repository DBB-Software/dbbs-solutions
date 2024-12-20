import { parseJSONWithFallback } from '../../src/utils'

describe('parseJSONWithFallback', () => {
  test.each([
    {
      jsonString: '{"key": "value"}',
      result: { key: 'value' }
    },
    {
      jsonString: '{"key": "value"}',
      defaultValue: { defaultKey: 'defaultValue' },
      result: { key: 'value' }
    },
    {
      jsonString: '{"key": "value"', // invalid json string
      defaultValue: { defaultKey: 'defaultValue' },
      result: { defaultKey: 'defaultValue' }
    },
    {
      jsonString: '{"key": "value"', // invalid json string
      result: { defaultKey: 'defaultValue' }
    }
  ])('should parse or fallback JSON string for: %s', ({ jsonString, result, defaultValue }) => {
    const parsedData = parseJSONWithFallback(jsonString, defaultValue)
    if (parsedData) {
      expect(parsedData).toEqual(result)
    } else {
      expect(parsedData).toBeUndefined()
    }
  })
})
