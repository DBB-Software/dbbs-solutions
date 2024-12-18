import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'

beforeAll(() => {
  fetchMock.enableMocks()
})

afterAll(() => {
  fetchMock.disableMocks()
})
