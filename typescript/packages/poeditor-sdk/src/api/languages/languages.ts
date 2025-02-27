import { WithAuthAndProject } from '../../types'
import { httpClient } from '../../utils/index'
import { AddLanguageToProjectPayload, ListProjectLanguagesResponse, ListAvailableLanguagesResponse } from './types'

const LANGUAGES_PATH = 'languages'

export const languagesApi = {
  /**
   * Fetches the list of available languages supported by POEditor.
   * Useful to provide a dropdown or selector for adding a new language to a project.
   * Endpoint: /languages/available
   */
  async listAvailableLanguages(apiToken: string) {
    return httpClient<ListAvailableLanguagesResponse>({
      url: `${LANGUAGES_PATH}/available`,
      body: {
        api_token: apiToken
      }
    })
  },

  /**
   * Fetches the list of languages in a specific project.
   * Returns the project's languages along with their translation progress and last edit timestamp.
   * Endpoint: /languages/list
   */
  async listProjectLanguages({ apiToken, projectId }: WithAuthAndProject<object>) {
    return httpClient<ListProjectLanguagesResponse>({
      url: `${LANGUAGES_PATH}/list`,
      body: {
        api_token: apiToken,
        id: projectId.toString()
      }
    })
  },

  /**
   * Adds a new language to a specific project.
   * Useful when the app needs to support a new locale dynamically.
   * Endpoint: /languages/add
   */
  async addLanguageToProject({ apiToken, projectId, language }: WithAuthAndProject<AddLanguageToProjectPayload>) {
    return httpClient<void>({
      url: `${LANGUAGES_PATH}/add`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        language
      }
    })
  }
}
