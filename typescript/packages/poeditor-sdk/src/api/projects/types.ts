import { POEditorAPIResponse } from '../../types'

// General Project Types
export interface Project {
  id: number
  name: string
  public: 0 | 1
  open: 0 | 1
  created: string
}

export interface ProjectDetails extends Project {
  description: string
  reference_language: string
  fallback_language: string
  terms: number
}
export interface Term {
  term: string
  context?: string
  reference?: string
  plural?: string
  tags?: string
}

// Payload Types

export interface SyncTermsPayload {
  terms: Term[]
}

export interface ExportProjectPayload {
  language: string
  type: string
  filters?: string | string[]
  order?: string
  tags?: string | string[]
  fallback_language?: string
  options?: Array<Record<string, number | string>>
}

// Result Types
export interface UploadProjectTermsResult {
  parsed: number
  added: number
  deleted: number
}

export interface UploadProjectTranslationsResult {
  parsed: number
  added: number
  updated: number
}

export interface SyncTermsResult {
  parsed: number
  added: number
  updated: number
  deleted: number
}

export interface ExportProjectResult {
  url: string
}

// Response Types
export type ListProjectsResponse = POEditorAPIResponse<{ projects: Project[] }>
export type ViewProjectResponse = POEditorAPIResponse<{ project: ProjectDetails }>
export type SyncProjectResponse = POEditorAPIResponse<{ terms: SyncTermsResult }>
export type ExportProjectResponse = POEditorAPIResponse<{
  url: string
}>
