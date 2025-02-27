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

export const mockListTermsPayload: ListTermsPayload = {
  language: 'en'
}
export const mockListTermsResponse: ListTermsResponse = {
  response: { status: 'success', code: '200', message: 'Terms retrieved' },
  result: {
    terms: [
      {
        term: 'Hello',
        context: '',
        plural: '',
        created: '2024-01-01',
        updated: '2024-01-02',
        translation: {
          content: 'Hola',
          fuzzy: 0,
          proofread: 1,
          updated: '2024-01-02'
        },
        reference: '',
        tags: ['greeting'],
        comment: ''
      }
    ]
  }
}

export const mockAddTermsResponse: AddTermsResponse = {
  response: { status: 'success', code: '200', message: 'Terms added' },
  result: {
    terms: { parsed: 1, added: 1 }
  }
}

export const mockUpdateTermsResponse: UpdateTermsResponse = {
  response: { status: 'success', code: '200', message: 'Terms updated' },
  result: {
    terms: { parsed: 1, updated: 1 }
  }
}

export const mockDeleteTermsResponse: DeleteTermsResponse = {
  response: { status: 'success', code: '200', message: 'Terms deleted' },
  result: {
    terms: { parsed: 1, deleted: 1 }
  }
}

export const mockAddTermsPayload: AddTermsPayload = {
  terms: [{ term: 'Hello', context: '', reference: '', plural: '', comment: '', tags: ['greeting'] }]
}

export const mockUpdateTermsPayload: UpdateTermsPayload = {
  terms: [{ term: 'Hello', newTerm: 'Hi', newContext: 'Greeting' }]
}

export const mockDeleteTermsPayload: DeleteTermsPayload = {
  terms: [{ term: 'Hello', context: '' }]
}
