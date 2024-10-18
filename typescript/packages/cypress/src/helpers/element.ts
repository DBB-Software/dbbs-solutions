const element = (testId: string, options = { timeout: Cypress.env('defaultCommandTimeout') }) =>
  cy.getByTestId(testId, options)

export default element
