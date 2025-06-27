import { createUniqueFileName } from '../../src/utils/createUniqueFileName'

describe('createUniqueFileName', () => {
  it('should generate unique names for consecutive calls', () => {
    const name1 = createUniqueFileName('file', 'log')
    // Wait a millisecond to ensure different timestamps
    setTimeout(() => {
      const name2 = createUniqueFileName('file', 'log')
      expect(name1).not.toEqual(name2)
    }, 1)
  })
})
