import { WithAuthAndProject } from '../../types'
import { httpClient } from '../../utils'
import {
  AddTranslationPayload,
  UpdateTranslationPayload,
  DeleteTranslationPayload,
  AddTranslationsResponse,
  UpdateTranslationsResponse,
  DeleteTranslationsResponse
} from './types'

const TRANSLATIONS_PATH = 'translations'

export const translationsApi = {
  /**
   * Adds translations for specific terms in a project.
   * Useful for programmatically populating translations in a specific language.
   * Endpoint: /translations/add
   */
  async addTranslation({ apiToken, projectId, language, data }: WithAuthAndProject<AddTranslationPayload>) {
    return httpClient<AddTranslationsResponse>({
      url: `${TRANSLATIONS_PATH}/add`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        language,
        data: JSON.stringify(data)
      }
    })
  },

  /**
   * Updates existing translations for terms in a specific project and language.
   * Useful for modifying translations as the app evolves.
   * Endpoint: /translations/update
   */
  async updateTranslation({ apiToken, projectId, language, data }: WithAuthAndProject<UpdateTranslationPayload>) {
    return httpClient<UpdateTranslationsResponse>({
      url: `${TRANSLATIONS_PATH}/update`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        language,
        data: JSON.stringify(data)
      }
    })
  },

  /**
   * Deletes translations for specific terms in a project and language.
   * Useful for cleaning up unused or outdated translations.
   * Endpoint: /translations/delete
   */
  async deleteTranslation({ apiToken, projectId, language, data }: WithAuthAndProject<DeleteTranslationPayload>) {
    return httpClient<DeleteTranslationsResponse>({
      url: `${TRANSLATIONS_PATH}/delete`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        language,
        data: JSON.stringify(data)
      }
    })
  }
}
