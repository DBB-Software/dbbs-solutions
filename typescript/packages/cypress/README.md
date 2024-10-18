## Name: cypress

## Description

The package includes a set of helpers for writing Cypress tests in a more concise and readable manner.

## Usage

Install `@dbbs/cypress` into your application using yarn.

```bash
yarn add @dbbs/cypress
```

## Examples

To utilize Cypress helpers in your tests, such as element, which provides an element by its ID, import it and pass the ID of the desired element. The result obtained is a Cypress element and possesses all of its properties and methods.
```ts
import { element } from '@dbbs/cypress'

describe('home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render page title', () => {
    element('app-title').contains('Sample APP')
  })
})
```

## Features

- Cypress helpers provide a set of tools for writing Cypress tests in a more concise and readable manner.

## Feature Keywords

- cypress-helpers

## Language and framework

- React
- Next.js
- TypeScript

## Type

- Package

## Tech Category

- Front-end
- e2e
- Testing

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy

## Links

[Test. Automate. Accelerate.](https://www.cypress.io/)

## Relations

- /apps/web-spa
- /apps/web-ssr

## External dependencies

N/A
