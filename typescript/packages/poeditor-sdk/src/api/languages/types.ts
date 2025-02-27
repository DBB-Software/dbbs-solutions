// Payload Types

import { POEditorAPIResponse } from '../../types'

export type AddLanguageToProjectPayload = {
  language: string
}

export type UpdateProjectLanguageDataOption = {
  term: string
  context: string
  translation: {
    content: string | { [key: string]: string }
    fuzzy?: number
  }
}

export type UpdateProjectLanguagePayload = {
  language: string
  data: Array<UpdateProjectLanguageDataOption>
}

// Response Types
export interface Language {
  name: string
  code: string
  translations: number
  percentage: number
  updated: string
}

export type ListProjectLanguagesResponse = POEditorAPIResponse<{ languages: Language[] }>

export interface AvailableLanguage {
  name: string
  code: string
}

export type ListAvailableLanguagesResponse = POEditorAPIResponse<{ languages: AvailableLanguage[] }>
