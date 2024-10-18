import { Context } from 'koa'

export const createMockContext = (overrides?: Partial<Context>): Context => {
  const mockContext = {
    app: {},
    req: {},
    res: {},
    request: {
      body: {}
    },
    response: {},
    state: {},
    cookies: {},
    originalUrl: '',
    ip: '',
    accept: {},
    params: {},
    send: jest.fn(),
    ...overrides
  } as unknown as Context

  return mockContext
}
