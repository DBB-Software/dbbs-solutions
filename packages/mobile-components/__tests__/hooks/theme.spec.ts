import { renderHook } from '@testing-library/react-hooks'
import { useColorScheme } from 'react-native'
import { useDefinedTheme } from '../../src/hooks'
import { darkTheme, lightTheme } from '../../src/core'

const mockUseColorScheme = useColorScheme as jest.Mock

jest.mock('react-native', () => ({
  useColorScheme: jest.fn()
}))
jest.mock('react-native-paper', () => ({
  useTheme: jest.fn(),
  MD3LightTheme: { colors: {}, fonts: {} },
  MD3DarkTheme: { colors: {}, fonts: {} },
  MD3Theme: { colors: {}, fonts: {} }
}))

describe('useDefinedTheme', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  test.each([
    {
      colorScheme: 'dark',
      theme: darkTheme
    },
    {
      colorScheme: 'light',
      theme: lightTheme
    },
    {
      colorScheme: 'light',
      isDark: true,
      theme: darkTheme
    }
  ])('Should return correct theme for: %s', ({ colorScheme, isDark, theme }) => {
    mockUseColorScheme.mockReturnValueOnce(colorScheme)
    const { result } = renderHook(() => useDefinedTheme(isDark))
    expect(result.current).toEqual(theme)
  })
})
