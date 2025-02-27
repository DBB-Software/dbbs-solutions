export function createMockPlugins(overrides: Partial<Record<string, unknown>> = {}) {
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
