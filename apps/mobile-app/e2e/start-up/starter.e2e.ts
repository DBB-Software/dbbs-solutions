import { by, element, expect } from 'detox'

describe('Example', () => {
  it('should have home screen', async () => {
    await expect(element(by.id('test'))).toBeVisible()
  })
})
