import '@testing-library/jest-dom'

jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      getString: jest.fn(),
      delete: jest.fn()
    }))
  }
})
