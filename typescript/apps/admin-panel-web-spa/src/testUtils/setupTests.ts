import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'
import { mswServer } from './server'

beforeEach(() => {
  fetchMock.resetMocks()
})

beforeAll(() => {
  fetchMock.enableMocks()
  mswServer.listen()
})

afterAll(() => {
  fetchMock.disableMocks()
  mswServer.close()
})
