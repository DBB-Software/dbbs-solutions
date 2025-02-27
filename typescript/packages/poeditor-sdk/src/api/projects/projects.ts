import { WithAuthAndProject } from '../../types'
import { httpClient } from '../../utils/index'
import {
  SyncTermsPayload,
  ExportProjectPayload,
  ListProjectsResponse,
  ViewProjectResponse,
  SyncProjectResponse,
  ExportProjectResponse
} from './types'

const PROJECTS_PATH = 'projects'

export const projectsApi = {
  /**
   * Fetches the list of all localization projects owned by the user.
   * Useful for displaying or selecting projects in a UI.
   * Endpoint: /projects/list
   */
  async listProjects(apiToken: string) {
    return httpClient<ListProjectsResponse>({
      url: `${PROJECTS_PATH}/list`,
      body: {
        api_token: apiToken
      }
    })
  },

  /**
   * Fetches the details of a specific project, such as metadata, settings, or statistics.
   * This is helpful for viewing project-specific information like the list of languages or term stats.
   * Endpoint: /projects/view
   */
  async viewProject({ apiToken, projectId }: WithAuthAndProject<object>) {
    return httpClient<ViewProjectResponse>({
      url: `${PROJECTS_PATH}/view`,
      body: {
        api_token: apiToken,
        id: projectId.toString()
      }
    })
  },

  /**
   * Synchronizes terms in the specified project with the provided data.
   * Useful for ensuring the project's terms are up-to-date and in sync with the app's requirements.
   * Note: This method deletes terms that are not in the provided array.
   * Endpoint: /projects/sync
   */
  async syncTerms({ apiToken, projectId, terms }: WithAuthAndProject<SyncTermsPayload>) {
    return httpClient<SyncProjectResponse>({
      url: `${PROJECTS_PATH}/sync`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        data: JSON.stringify(terms)
      }
    })
  },

  /**
   * Exports translations for a specific project.
   * The exported file can be downloaded in various formats (e.g., JSON, i18next, Android XML).
   * Options allow for filters, tags, and advanced settings like fallback language or sorting terms.
   * Endpoint: /projects/export
   */
  async exportProject({ apiToken, projectId, ...restParams }: WithAuthAndProject<ExportProjectPayload>) {
    const { filters, tags, options, ...otherParams } = restParams

    return httpClient<ExportProjectResponse>({
      url: `${PROJECTS_PATH}/export`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        ...otherParams,
        ...(filters && { filters: JSON.stringify(filters) }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(options && { options: JSON.stringify(options) })
      }
    })
  }
}
