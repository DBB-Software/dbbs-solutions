import {
  ListProjectsResponse,
  ViewProjectResponse,
  SyncProjectResponse,
  ExportProjectResponse,
  SyncTermsPayload,
  ExportProjectPayload
} from './types'

export const mockListProjectsResponse: ListProjectsResponse = {
  response: { status: 'success', code: '200', message: 'Projects retrieved' },
  result: {
    projects: [
      { id: 1, name: 'Project A', public: 0, open: 1, created: '2024-01-01' },
      { id: 2, name: 'Project B', public: 1, open: 0, created: '2024-01-02' }
    ]
  }
}

export const mockViewProjectResponse: ViewProjectResponse = {
  response: { status: 'success', code: '200', message: 'Project details retrieved' },
  result: {
    project: {
      id: 1,
      name: 'Project A',
      description: 'Test project',
      public: 0,
      open: 1,
      reference_language: 'en',
      fallback_language: 'es',
      terms: 100,
      created: '2024-01-01'
    }
  }
}

export const mockSyncProjectResponse: SyncProjectResponse = {
  response: { status: 'success', code: '200', message: 'Terms synchronized successfully' },
  result: {
    terms: { parsed: 100, added: 30, updated: 50, deleted: 20 }
  }
}

export const mockExportProjectResponse: ExportProjectResponse = {
  response: { status: 'success', code: '200', message: 'Export successful' },
  result: { url: 'https://poeditor.com/download/projectA.json' }
}

export const mockSyncTermsPayload: SyncTermsPayload = {
  terms: [{ term: 'hello', context: 'greeting' }]
}

export const mockExportProjectPayload: ExportProjectPayload = {
  language: 'en',
  type: 'json',
  filters: 'translated',
  order: 'asc'
}
