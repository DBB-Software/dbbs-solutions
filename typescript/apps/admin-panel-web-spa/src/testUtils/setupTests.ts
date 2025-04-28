import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'
import { mswServer } from './server'

// TODO (#2029): Remove this after flaky tests fix
jest.setTimeout(30000)

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
