import {
  AddTranslationsResponse,
  UpdateTranslationsResponse,
  DeleteTranslationsResponse,
  AddTranslationPayload,
  UpdateTranslationPayload,
  DeleteTranslationPayload
} from './types'

export const mockAddTranslationsResponse: AddTranslationsResponse = {
  response: { status: 'success', code: '200', message: 'Translations added successfully' },
  result: { translations: { parsed: 10, added: 8 } }
}

export const mockUpdateTranslationsResponse: UpdateTranslationsResponse = {
  response: { status: 'success', code: '200', message: 'Translations updated successfully' },
  result: { translations: { parsed: 10, updated: 7 } }
}

export const mockDeleteTranslationsResponse: DeleteTranslationsResponse = {
  response: { status: 'success', code: '200', message: 'Translations deleted successfully' },
  result: { translations: { parsed: 10, deleted: 6 } }
}

export const mockAddTranslationPayload: AddTranslationPayload = {
  language: 'en',
  data: [
    { term: 'hello', translation: { content: 'Hello' } },
    { term: 'goodbye', translation: { content: 'Goodbye' } }
  ]
}

export const mockUpdateTranslationPayload: UpdateTranslationPayload = {
  language: 'en',
  data: [
    { term: 'hello', translation: { content: 'Hi' } },
    { term: 'goodbye', translation: { content: 'Farewell' } }
  ]
}

export const mockDeleteTranslationPayload: DeleteTranslationPayload = {
  language: 'en',
  data: [{ term: 'hello' }, { term: 'goodbye' }]
}
