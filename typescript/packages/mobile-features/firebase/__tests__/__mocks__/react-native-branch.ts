export const BranchParams = jest.fn()

const mockBranch = {
  initSession: jest.fn(),
  createBranchUniversalObject: jest.fn().mockReturnValue({
    generateShortUrl: jest.fn(),
    showShareSheet: jest.fn()
  }),
  STANDARD_EVENT_ADD_TO_CART: 'ADD_TO_CART',
  OS: 'ios'
}

export default mockBranch
