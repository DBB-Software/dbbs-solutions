import { renderHook } from '@testing-library/react-hooks'
import { useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { useDefinedTheme } from '../../src/shared/hooks'

const mockUseColorScheme = useColorScheme as jest.Mock

jest.mock('react-native', () => ({
  useColorScheme: jest.fn()
}))
jest.mock('react-native-paper', () => ({
  useTheme: jest.fn(),
  MD3LightTheme: { colors: { primary: '#fff' }, fonts: {} },
  MD3DarkTheme: { colors: { primary: '#000' }, fonts: {} },
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
      theme: MD3DarkTheme
    },
    {
      colorScheme: 'light',
      theme: MD3LightTheme
    },
    {
      colorScheme: 'light',
      theme: MD3LightTheme,
      lightTheme: MD3LightTheme
    },
    {
      colorScheme: 'dark',
      theme: MD3DarkTheme,
      darkTheme: MD3DarkTheme
    },
    {
      colorScheme: 'light',
      isDark: true,
      theme: MD3DarkTheme
    }
  ])('Should return correct theme for: %s', ({ colorScheme, isDark, theme, lightTheme, darkTheme }) => {
    mockUseColorScheme.mockReturnValueOnce(colorScheme)
    const { result } = renderHook(() => useDefinedTheme({ isDark, lightTheme, darkTheme }))
    expect(result.current).toEqual(theme)
  })
})
