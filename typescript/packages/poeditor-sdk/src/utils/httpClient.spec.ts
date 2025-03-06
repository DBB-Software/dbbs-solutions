import fetchMock from 'jest-fetch-mock'
import { httpClient } from './httpClient'
import { POEDITOR_API_BASE_URL } from '../constants'

describe('httpClient', () => {
  const endpoint = '/test-endpoint'
  const mockToken = 'test-token'
  const mockResponse = { response: { status: 'success', message: 'OK' }, result: { key: 'value' } }
  const mockErrorMessage = 'Internal Server Error'

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should make a correct API call and return the expected response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const result = await httpClient<typeof mockResponse.result>({ body: { api_token: mockToken }, url: endpoint })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ api_token: mockToken })
    })
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error on HTTP failure', async () => {
    fetchMock.mockResponseOnce('', { status: 500 })

    await expect(httpClient({ body: { api_token: mockToken }, url: endpoint })).rejects.toThrow(
      'HTTP error! Status: 500'
    )
  })

  it('should throw an error on invalid JSON response', async () => {
    fetchMock.mockResponseOnce(mockErrorMessage)

    await expect(httpClient({ body: { api_token: mockToken }, url: endpoint })).rejects.toThrow(
      'Invalid JSON response from server'
    )
  })

  it('should throw an error on API-level failure', async () => {
    const mockErrorMessage = 'API request failed'
    fetchMock.mockRejectedValueOnce(new Error(mockErrorMessage))

    await expect(httpClient({ body: { api_token: mockToken }, url: endpoint })).rejects.toThrow(mockErrorMessage)
  })
})
