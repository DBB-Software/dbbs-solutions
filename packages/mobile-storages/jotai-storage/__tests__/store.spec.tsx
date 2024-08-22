import { store, persistor } from '../src'

describe('Jotai Store and Persistor', () => {
  it('Jotai Store should be initialized correctly', () => {
    expect(store).toBeDefined()
  })

  it('Jotai Persistor should be a valid JSON storage', () => {
    expect(persistor).toBeDefined()
    // Ensure AsyncStorage is correctly used in the JSON storage
    expect(persistor).toEqual({
      getItem: expect.any(Function),
      setItem: expect.any(Function),
      removeItem: expect.any(Function)
    })
  })
})
