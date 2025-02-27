import fetchMock from 'jest-fetch-mock'
import { termsApi } from './terms'
import {
  mockListTermsResponse,
  mockAddTermsResponse,
  mockUpdateTermsResponse,
  mockDeleteTermsResponse,
  mockAddTermsPayload,
  mockUpdateTermsPayload,
  mockDeleteTermsPayload,
  mockListTermsPayload
} from './mocks'
import { POEDITOR_API_BASE_URL } from '../../constants'

describe('termsApi', () => {
  const apiToken = 'test-api-token'
  const projectId = '12345'
  const mockErrorMessage = 'Internal Server Error'
  const mockError = new Error(mockErrorMessage)

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('listTerms', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListTermsResponse))
      const response = await termsApi.listTerms({ apiToken, projectId, ...mockListTermsPayload })
      expect(response).toEqual(mockListTermsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)
      await expect(termsApi.listTerms({ apiToken, projectId, ...mockListTermsPayload })).rejects.toThrow(
        mockErrorMessage
      )
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListTermsResponse))
      await termsApi.listTerms({ apiToken, projectId, ...mockListTermsPayload })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}terms/list`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          language: String(mockListTermsPayload.language)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })

  describe('addTerms', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddTermsResponse))
      const response = await termsApi.addTerms({ apiToken, projectId, ...mockAddTermsPayload })
      expect(response).toEqual(mockAddTermsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)
      await expect(termsApi.addTerms({ apiToken, projectId, ...mockAddTermsPayload })).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddTermsResponse))
      await termsApi.addTerms({ apiToken, projectId, ...mockAddTermsPayload })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}terms/add`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          data: JSON.stringify(mockAddTermsPayload.terms)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })

  describe('updateTerms', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockUpdateTermsResponse))
      const response = await termsApi.updateTerms({ apiToken, projectId, ...mockUpdateTermsPayload })
      expect(response).toEqual(mockUpdateTermsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)
      await expect(termsApi.updateTerms({ apiToken, projectId, ...mockUpdateTermsPayload })).rejects.toThrow(
        mockErrorMessage
      )
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockUpdateTermsResponse))
      await termsApi.updateTerms({ apiToken, projectId, ...mockUpdateTermsPayload })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}terms/update`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          data: JSON.stringify(mockUpdateTermsPayload.terms)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })

  describe('deleteTerms', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockDeleteTermsResponse))
      const response = await termsApi.deleteTerms({ apiToken, projectId, ...mockDeleteTermsPayload })
      expect(response).toEqual(mockDeleteTermsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)
      await expect(termsApi.deleteTerms({ apiToken, projectId, ...mockDeleteTermsPayload })).rejects.toThrow(
        mockErrorMessage
      )
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockDeleteTermsResponse))
      await termsApi.deleteTerms({ apiToken, projectId, ...mockDeleteTermsPayload })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}terms/delete`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          data: JSON.stringify(mockDeleteTermsPayload.terms)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })
})
