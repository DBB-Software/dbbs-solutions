import fetchMock from 'jest-fetch-mock'
import { projectsApi } from './projects'
import {
  mockListProjectsResponse,
  mockViewProjectResponse,
  mockSyncProjectResponse,
  mockExportProjectResponse,
  mockSyncTermsPayload,
  mockExportProjectPayload
} from './mocks'
import { POEDITOR_API_BASE_URL } from '../../constants'

describe('projectsApi', () => {
  const apiToken = 'test-api-token'
  const projectId = '12345'
  const mockErrorMessage = 'Internal Server Error'
  const mockError = new Error(mockErrorMessage)

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('listProjects', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListProjectsResponse))

      const response = await projectsApi.listProjects(apiToken)

      expect(response).toEqual(mockListProjectsResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(projectsApi.listProjects(apiToken)).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockListProjectsResponse))

      await projectsApi.listProjects(apiToken)

      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}projects/list`, {
        body: new URLSearchParams({ api_token: apiToken }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })

  describe('viewProject', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockViewProjectResponse))

      const response = await projectsApi.viewProject({ apiToken, projectId })

      expect(response).toEqual(mockViewProjectResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(projectsApi.viewProject({ apiToken, projectId })).rejects.toThrow(mockErrorMessage)
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockViewProjectResponse))

      await projectsApi.viewProject({ apiToken, projectId })

      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}projects/view`, {
        body: new URLSearchParams({ api_token: apiToken, id: projectId }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })

  describe('syncTerms', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockSyncProjectResponse))

      const response = await projectsApi.syncTerms({ apiToken, projectId, ...mockSyncTermsPayload })

      expect(response).toEqual(mockSyncProjectResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(projectsApi.syncTerms({ apiToken, projectId, ...mockSyncTermsPayload })).rejects.toThrow(
        mockErrorMessage
      )
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockSyncProjectResponse))

      await projectsApi.syncTerms({ apiToken, projectId, ...mockSyncTermsPayload })

      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}projects/sync`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId,
          data: JSON.stringify(mockSyncTermsPayload.terms)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })

  describe('exportProject', () => {
    it('should return mock data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockExportProjectResponse))

      const response = await projectsApi.exportProject({ apiToken, projectId, ...mockExportProjectPayload })

      expect(response).toEqual(mockExportProjectResponse)
    })

    it('should handle an API error', async () => {
      fetchMock.mockRejectOnce(mockError)

      await expect(projectsApi.exportProject({ apiToken, projectId, ...mockExportProjectPayload })).rejects.toThrow(
        mockErrorMessage
      )
    })

    it('should make the correct API call with expected payload', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockExportProjectResponse))

      await projectsApi.exportProject({ apiToken, projectId, ...mockExportProjectPayload })

      expect(fetchMock).toHaveBeenCalledWith(`${POEDITOR_API_BASE_URL}projects/export`, {
        body: new URLSearchParams({
          api_token: apiToken,
          id: projectId.toString(),
          language: mockExportProjectPayload.language,
          type: mockExportProjectPayload.type,
          ...(mockExportProjectPayload.order ? { order: mockExportProjectPayload.order } : {}),
          filters: JSON.stringify(mockExportProjectPayload.filters)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
    })
  })
})
