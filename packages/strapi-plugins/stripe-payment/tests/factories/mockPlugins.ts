import { Strapi } from '@strapi/strapi'

export function createMockPlugins(overrides: Partial<Record<string, any>> = {}) {
  return {
    'users-permissions': {
      services: {
        jwt: {
          getToken: jest.fn().mockResolvedValue({ id: 1 })
        }
      }
    },
    ...overrides
  }
}
