import { POEditorAPIResponse } from '../../types'

// Translation Types
export interface Translation {
  term: string
  context?: string
  translation: {
    content: string | Record<string, string>
  }
}

export interface DeleteTranslation {
  term: string
  context?: string
}

// Payload Types
export interface AddTranslationPayload {
  language: string
  data: Translation[]
}

export interface UpdateTranslationPayload {
  language: string
  data: Translation[]
}

export interface DeleteTranslationPayload {
  language: string
  data: DeleteTranslation[]
}

// Result Types
export interface AddTranslationsResult {
  parsed: number
  added: number
}

export interface UpdateTranslationsResult {
  parsed: number
  updated: number
}

export interface DeleteTranslationsResult {
  parsed: number
  deleted: number
}

// Response Types
export type AddTranslationsResponse = POEditorAPIResponse<{ translations: AddTranslationsResult }>

export type UpdateTranslationsResponse = POEditorAPIResponse<{ translations: UpdateTranslationsResult }>

export type DeleteTranslationsResponse = POEditorAPIResponse<{ translations: DeleteTranslationsResult }>
