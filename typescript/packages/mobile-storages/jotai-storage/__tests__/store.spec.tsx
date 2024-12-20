import { persistor } from '../src'

describe('Jotai Store and Persistor', () => {
  it('Jotai Persistor should be a valid JSON storage', () => {
    expect(persistor).toBeDefined()
    expect(persistor).toEqual({
      getItem: expect.any(Function),
      setItem: expect.any(Function),
      removeItem: expect.any(Function)
    })
  })
})
