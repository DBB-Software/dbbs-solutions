Cypress.Commands.add('getByTestId', (testId, options) => cy.get(`[data-testid=${testId}]`, options))
