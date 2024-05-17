import '@testing-library/react-native/extend-expect'
import '@jest/globals'

import fetchMock from 'jest-fetch-mock'

beforeAll(() => {
  fetchMock.enableMocks()
})

afterAll(() => {
  fetchMock.disableMocks()
})

jest.useFakeTimers()
