import fetchMock from 'jest-fetch-mock'
import { translationsApi } from './translations'
import {
  mockAddTranslationsResponse,
  mockUpdateTranslationsResponse,
  mockDeleteTranslationsResponse,
  mockAddTranslationPayload,
  mockUpdateTranslationPayload,
  mockDeleteTranslationPayload
} from './mocks'
import { POEDITOR_API_BASE_URL } from '../../constants'

describe('translationsApi', () => {
  const apiToken = 'test-api-token'
  const projectId = '12345'
  const mockErrorMessage = 'Internal Server Error'
  const mockError = new Error(mockErrorMessage)

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('addTranslation', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddTranslationsResponse))

      const response = await translationsApi.addTranslation({ apiToken, projectId, ...mockAddTranslationPayload })

      expect(response).toEqual(mockAddTranslationsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(
        translationsApi.addTranslation({ apiToken, projectId, ...mockAddTranslationPayload })
      ).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddTranslationsResponse))

      await translationsApi.addTranslation({ apiToken, projectId, ...mockAddTranslationPayload })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}translations/add`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          language: mockAddTranslationPayload.language,
          data: JSON.stringify(mockAddTranslationPayload.data)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })

  describe('updateTranslation', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockUpdateTranslationsResponse))

      const response = await translationsApi.updateTranslation({ apiToken, projectId, ...mockUpdateTranslationPayload })

      expect(response).toEqual(mockUpdateTranslationsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(
        translationsApi.updateTranslation({ apiToken, projectId, ...mockUpdateTranslationPayload })
      ).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockUpdateTranslationsResponse))

      await translationsApi.updateTranslation({ apiToken, projectId, ...mockUpdateTranslationPayload })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}translations/update`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          language: mockUpdateTranslationPayload.language,
          data: JSON.stringify(mockUpdateTranslationPayload.data)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })

  describe('deleteTranslation', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockDeleteTranslationsResponse))

      const response = await translationsApi.deleteTranslation({ apiToken, projectId, ...mockDeleteTranslationPayload })

      expect(response).toEqual(mockDeleteTranslationsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(
        translationsApi.deleteTranslation({ apiToken, projectId, ...mockDeleteTranslationPayload })
      ).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockDeleteTranslationsResponse))

      await translationsApi.deleteTranslation({ apiToken, projectId, ...mockDeleteTranslationPayload })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}translations/delete`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          language: mockDeleteTranslationPayload.language,
          data: JSON.stringify(mockDeleteTranslationPayload.data)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })
})
