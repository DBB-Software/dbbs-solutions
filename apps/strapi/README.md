## Name: strapi

## Description

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

## Usage

Make a copy of the configured Strapi application and customize it according to your requirements.

## Examples

### Example GraphQL Query for Multi-Table Search with Pagination:

The example query provided illustrates how to perform a multi-table search using GraphQL in Strapi, incorporating pagination and filtering by specific fields.
This approach grants the client side significant control over filtering, pagination and other operations, making it highly flexible and easily extensible.
To delve into the customization details and parameters involved:
~~~~
query ($query: String, $page: Int, $pageSize: Int) {
  showcases(
    filters: {
      or: [
        { description: { containsi: $query } },
        { title: { containsi: $query } }
      ]
    },
    pagination: {
      page: $page,
      pageSize: $pageSize
    }
  ) {
      data {
        id
        attributes {
          title
          description
        }
      }
  },
  blogArticles(
    filters: {
      or: [
        { description: { containsi: $query } },
        { title: { containsi: $query } }
      ]
    },
    pagination: {
      page: $page,
      pageSize: $pageSize
    }
  ) {
    data {
      id
      attributes {
        title
        description
      }
    }
  }
}
~~~~

## Features

If any form changes are made in the platform, it will be possible to automatically update it in all related systems.

Supports multi-table search using GraphQL, including pagination and filtering by specific fields.
(You can use the built-in capabilities of the @strapi/plugin-graphql)

## Feature Keywords

- strapi-support
- graphql-search
- multi-table-search

## Language and framework

- Node.js
- Strapi
- JavaScript
- TypeScript

## Type

- Application

## Tech Category

- Back-end
- Front-end

## Domain Category

- Common
- admin-panel
- headless-cms

## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- asa-dbb
- vks-dbb

## Links

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.
- [Strapi GraphQL documentation](https://docs.strapi.io/dev-docs/api/graphql) - Find out about the power of built-in strapi graphql plugin.
- [Strapi GitHub repository](https://github.com/strapi/strapi)

## External dependencies

- @strapi/*
- react
- react-dom
- styled-components
