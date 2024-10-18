/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable<Subject> {
    getByTestId(testId: string, options?: Record<string, unknown>): Chainable<Element> | Chainable<JQuery<HTMLElement>>
  }
}
