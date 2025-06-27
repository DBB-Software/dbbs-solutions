import { element } from '@dbbs/cypress'

describe('index page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render page title', () => {
    element('app-title').contains('Hello from Remix!')
  })
})
