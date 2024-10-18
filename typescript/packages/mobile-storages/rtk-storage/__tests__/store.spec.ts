import { store, persistor } from '../src'

describe('RTK Store and Persistor', () => {
  it('RTK Store should be initialized correctly', () => {
    expect(store).toBeDefined()
    expect(store.getState()).toEqual(expect.any(Object))
  })

  it('RTK Persistor should be initialized correctly', () => {
    expect(persistor).toBeDefined()
    expect(persistor).toHaveProperty('persist')
  })
})
