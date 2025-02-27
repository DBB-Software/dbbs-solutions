import { Strapi } from '@strapi/strapi'
import { createMockPlugins } from './mockPlugins'

interface MockQueries {
  [key: string]: {
    findOne: unknown
    findMany: unknown
    count: unknown
    create: unknown
    update: unknown
    delete: unknown
  }
}

export const createMockStrapi = (overrides?: Partial<Strapi>): Strapi => {
  const mockQueries: MockQueries = {
    'plugin::stripe-payment.plan': {
      findOne: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    'plugin::stripe-payment.organization': {
      findOne: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    'plugin::stripe-payment.subscription': {
      findOne: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    'plugin::stripe-payment.product': {
      findOne: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    'plugin::users-permissions.user': {
      findOne: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }

  const mockContentType = {
    attributes: {}
  }

  const defaultStrapi = {
    query: (uid: string) => mockQueries[uid] || {},
    contentType: jest.fn().mockReturnValue(mockContentType),
    plugin: jest.fn(),
    plugins: createMockPlugins(),
    config: {
      get: jest.fn().mockReturnValue('fake-stripe-key'),
      set: jest.fn(),
      has: jest.fn()
    },
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
