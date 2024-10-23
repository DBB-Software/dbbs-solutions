import '@testing-library/jest-dom'

jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn()
}))

jest.mock('react-i18next', () => ({
  initReactI18next: jest.fn()
}))
