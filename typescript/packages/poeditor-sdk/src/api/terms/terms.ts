import { WithAuthAndProject } from '../../types'
import { httpClient } from '../../utils/index'
import {
  AddTermsPayload,
  AddTermsResponse,
  DeleteTermsPayload,
  DeleteTermsResponse,
  ListTermsPayload,
  ListTermsResponse,
  UpdateTermsPayload,
  UpdateTermsResponse
} from './types'

const TERMS_PATH = 'terms'

export const termsApi = {
  /**
   * Fetches the list of terms for a specific project.
   * Optionally includes translations if a language is specified.
   * Useful for displaying terms and their translations in the UI.
   * Endpoint: /terms/list
   */
  async listTerms({ apiToken, projectId, language }: WithAuthAndProject<ListTermsPayload>) {
    return httpClient<ListTermsResponse>({
      url: `${TERMS_PATH}/list`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        ...(language && { language })
      }
    })
  },

  /**
   * Adds new terms to a specific project.
   * Allows dynamic addition of terms as new keys are introduced in the application.
   * Endpoint: /terms/add
   */
  async addTerms({ apiToken, projectId, terms }: WithAuthAndProject<AddTermsPayload>) {
    return httpClient<AddTermsResponse>({
      url: `${TERMS_PATH}/add`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        data: JSON.stringify(terms)
      }
    })
  },

  /**
   * Updates existing terms in a project.
   * Useful for modifying term details such as context, reference, or tags.
   * Endpoint: /terms/update
   */
  async updateTerms({ apiToken, projectId, terms }: WithAuthAndProject<UpdateTermsPayload>) {
    return httpClient<UpdateTermsResponse>({
      url: `${TERMS_PATH}/update`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        data: JSON.stringify(terms)
      }
    })
  },

  /**
   * Deletes terms from a specific project.
   * Useful for removing outdated or unused keys to keep the project clean.
   * Endpoint: /terms/delete
   */
  async deleteTerms({ apiToken, projectId, terms }: WithAuthAndProject<DeleteTermsPayload>) {
    return httpClient<DeleteTermsResponse>({
      url: `${TERMS_PATH}/delete`,
      body: {
        api_token: apiToken,
        id: projectId.toString(),
        data: JSON.stringify(terms)
      }
    })
  }
}
