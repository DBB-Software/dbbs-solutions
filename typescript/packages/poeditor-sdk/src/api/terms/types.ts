import { POEditorAPIResponse } from '../../types'

// Term Types
export type AddTerm = {
  term: string
  context?: string
  reference?: string
  plural?: string
  comment?: string
  tags?: string[]
}

export type UpdateTerm = {
  term: string
  newTerm?: string
  newContext?: string
  newPlural?: string
  newReference?: string
  tags?: string[]
}

export type DeleteTerm = {
  term: string
  context?: string
}

// Payload Types
export type AddTermsPayload = {
  terms: AddTerm[]
}

export type UpdateTermsPayload = {
  terms: UpdateTerm[]
}

export type DeleteTermsPayload = {
  terms: Array<DeleteTerm>
}

export type ListTermsPayload = {
  language?: string
}

// Result Types
export interface AddTermsResult {
  parsed: number
  added: number
}

export interface UpdateTermsResult {
  parsed: number
  updated: number
}

export interface DeleteTermsResult {
  parsed: number
  deleted: number
}

// Response Types
export type ListTermsResponse = POEditorAPIResponse<{ terms: TermDetails[] }>

export type AddTermsResponse = POEditorAPIResponse<{ terms: AddTermsResult }>

export type UpdateTermsResponse = POEditorAPIResponse<{ terms: UpdateTermsResult }>

export type DeleteTermsResponse = POEditorAPIResponse<{ terms: DeleteTermsResult }>

export interface TermTranslationDetails {
  content: string | { [key: string]: string }
  fuzzy: number
  proofread: number
  updated: string
}

export interface TermDetails {
  term: string
  context: string
  plural: string
  created: string
  updated: string
  translation: TermTranslationDetails
  reference: string
  tags: string[]
  comment: string
}
