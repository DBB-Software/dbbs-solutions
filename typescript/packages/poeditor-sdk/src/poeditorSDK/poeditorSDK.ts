import {
  projectsApi,
  languagesApi,
  termsApi,
  translationsApi,
  ListAvailableLanguagesResponse,
  ListProjectLanguagesResponse,
  AddLanguageToProjectPayload,
  ListProjectsResponse,
  ViewProjectResponse,
  SyncTermsPayload,
  SyncProjectResponse,
  ExportProjectPayload,
  ExportProjectResponse,
  ListTermsPayload,
  ListTermsResponse,
  AddTermsPayload,
  AddTermsResponse,
  UpdateTermsPayload,
  UpdateTermsResponse,
  DeleteTermsPayload,
  DeleteTermsResponse,
  AddTranslationPayload,
  AddTranslationsResponse,
  UpdateTranslationPayload,
  UpdateTranslationsResponse,
  DeleteTranslationPayload,
  DeleteTranslationsResponse
} from '../api'

export class POEditorSDK {
  private apiToken: string

  private projectId?: number | string

  constructor(apiToken: string, projectId: number | string) {
    if (!apiToken) {
      throw new Error('API token is required to initialize POEditorSDK.')
    }

    this.apiToken = apiToken
    this.projectId = projectId
  }

  /**
   * Ensures projectId is available for methods that require it.
   */
  private getProjectId(): number | string {
    if (!this.projectId) {
      throw new Error('Project ID is required for this operation.')
    }
    return this.projectId
  }

  /**
   * Projects API
   */
  async listProjects(): Promise<ListProjectsResponse> {
    return projectsApi.listProjects(this.apiToken)
  }

  async viewProject(): Promise<ViewProjectResponse> {
    const projectId = this.getProjectId()

    return projectsApi.viewProject({
      apiToken: this.apiToken,
      projectId
    })
  }

  async syncTerms(payload: SyncTermsPayload): Promise<SyncProjectResponse> {
    const projectId = this.getProjectId()

    return projectsApi.syncTerms({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async exportProject(payload: ExportProjectPayload): Promise<ExportProjectResponse> {
    const projectId = this.getProjectId()

    return projectsApi.exportProject({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  /**
   * Languages API
   */
  async listAvailableLanguages(): Promise<ListAvailableLanguagesResponse> {
    return languagesApi.listAvailableLanguages(this.apiToken)
  }

  async listProjectLanguages(): Promise<ListProjectLanguagesResponse> {
    const projectId = this.getProjectId()

    return languagesApi.listProjectLanguages({
      apiToken: this.apiToken,
      projectId
    })
  }

  async addLanguageToProject(payload: AddLanguageToProjectPayload): Promise<void> {
    const projectId = this.getProjectId()

    return languagesApi.addLanguageToProject({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  /**
   * Terms API
   */
  async listTerms(payload: ListTermsPayload): Promise<ListTermsResponse> {
    const projectId = this.getProjectId()

    return termsApi.listTerms({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async addTerms(payload: AddTermsPayload): Promise<AddTermsResponse> {
    const projectId = this.getProjectId()

    return termsApi.addTerms({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async updateTerms(payload: UpdateTermsPayload): Promise<UpdateTermsResponse> {
    const projectId = this.getProjectId()

    return termsApi.updateTerms({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async deleteTerms(payload: DeleteTermsPayload): Promise<DeleteTermsResponse> {
    const projectId = this.getProjectId()

    return termsApi.deleteTerms({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  /**
   * Translations API
   */
  async addTranslation(payload: AddTranslationPayload): Promise<AddTranslationsResponse> {
    const projectId = this.getProjectId()

    return translationsApi.addTranslation({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async updateTranslation(payload: UpdateTranslationPayload): Promise<UpdateTranslationsResponse> {
    const projectId = this.getProjectId()

    return translationsApi.updateTranslation({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }

  async deleteTranslation(payload: DeleteTranslationPayload): Promise<DeleteTranslationsResponse> {
    const projectId = this.getProjectId()

    return translationsApi.deleteTranslation({
      ...payload,
      apiToken: this.apiToken,
      projectId
    })
  }
}
