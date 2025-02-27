import fetchMock from 'jest-fetch-mock'
import { languagesApi } from './languages'
import {
  mockListAvailableLanguagesResponse,
  mockListProjectLanguagesResponse,
  mockAddLanguageToProjectResponse,
  mockAddLanguageToProjectPayload
} from './mocks'
import { POEDITOR_API_BASE_URL } from '../../constants'

describe('languagesApi', () => {
  const apiToken = 'test-api-token'
  const projectId = '12345'
  const mockErrorMessage = 'Internal Server Error'
  const mockError = new Error(mockErrorMessage)

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('listAvailableLanguages', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListAvailableLanguagesResponse))

      const response = await languagesApi.listAvailableLanguages(apiToken)

      expect(response).toEqual(mockListAvailableLanguagesResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(languagesApi.listAvailableLanguages(apiToken)).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListAvailableLanguagesResponse))

      await languagesApi.listAvailableLanguages(apiToken)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}languages/available`, {
        body: new URLSearchParams({ api_token: apiToken }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })

  describe('listProjectLanguages', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListProjectLanguagesResponse))

      const response = await languagesApi.listProjectLanguages({ apiToken, projectId })

      expect(response).toEqual(mockListProjectLanguagesResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(languagesApi.listProjectLanguages({ apiToken, projectId })).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListProjectLanguagesResponse))

      await languagesApi.listProjectLanguages({ apiToken, projectId })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}languages/list`, {
        body: new URLSearchParams({ api_token: apiToken, id: projectId }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })

  describe('addLanguageToProject', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddLanguageToProjectResponse))

      const response = await languagesApi.addLanguageToProject({
        apiToken,
        projectId,
        ...mockAddLanguageToProjectPayload
      })

      expect(response).toEqual(mockAddLanguageToProjectResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(
        languagesApi.addLanguageToProject({ apiToken, projectId, ...mockAddLanguageToProjectPayload })
      ).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockAddLanguageToProjectResponse))

      await languagesApi.addLanguageToProject({ apiToken, projectId, ...mockAddLanguageToProjectPayload })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}languages/add`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          language: mockAddLanguageToProjectPayload.language
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      })
    })
  })
})
