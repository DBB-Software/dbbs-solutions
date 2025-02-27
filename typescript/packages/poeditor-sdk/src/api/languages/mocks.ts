import { POEditorAPIResponse } from '../../types'
import { AddLanguageToProjectPayload, ListProjectLanguagesResponse, ListAvailableLanguagesResponse } from './types'

export const mockListAvailableLanguagesResponse: ListAvailableLanguagesResponse = {
  response: { status: 'success', code: '200', message: 'Languages retrieved' },
  result: {
    languages: [
      { name: 'English', code: 'en' },
      { name: 'French', code: 'fr' },
      { name: 'German', code: 'de' }
    ]
  }
}

export const mockListProjectLanguagesResponse: ListProjectLanguagesResponse = {
  response: { status: 'success', code: '200', message: 'Project languages retrieved' },
  result: {
    languages: [
      { name: 'English', code: 'en', translations: 100, percentage: 100, updated: '2024-01-01' },
      { name: 'Spanish', code: 'es', translations: 80, percentage: 80, updated: '2024-01-02' }
    ]
  }
}

export const mockAddLanguageToProjectResponse: POEditorAPIResponse<void> = {
  response: { status: 'success', code: '200', message: 'Language added to project' },
  result: undefined
}

export const mockAddLanguageToProjectPayload: AddLanguageToProjectPayload = {
  language: 'es'
}
