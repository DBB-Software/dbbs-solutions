import { Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { createMockPlugins } from './mockPlugins'

export const createMockStrapi = (overrides?: Partial<Strapi>): Strapi => {
  const mockQuery = {
    create: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  const mockContentType = {
    attributes: {}
  }

  const defaultStrapi = {
    query: jest.fn().mockReturnValue(mockQuery),
    contentType: jest.fn().mockReturnValue(mockContentType),
    plugin: jest.fn(),
    plugins: createMockPlugins(),
    config: {
      get: jest.fn().mockReturnValue('fake-stripe-key'),
      set: jest.fn(),
      has: jest.fn()
    },
    errors,
    log: {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    }
  } as unknown as Strapi

  return {
    ...defaultStrapi,
    ...overrides
  }
}
