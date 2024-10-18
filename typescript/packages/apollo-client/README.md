# Apollo Client Package

## Description

The `apollo-client` package provides a robust GraphQL and Apollo Client setup for mobile and web applications within a monorepository. It includes a `useGraphQLClient` hook to handle both authorized and unauthorized GraphQL requests, along with a powerful code generation feature that automates the creation of Apollo hooks for efficient development.

## GraphQL Client Setup

The package offers a `useGraphQLClient` hook for managing GraphQL clients. The hook returns `{ authorizedClient, unAuthorizedClient }`, which can be used to differentiate between authorized and unauthorized requests.

```ts
import { useGraphQLClient } from '@your-package/apollo-client'

const { authorizedClient, unAuthorizedClient } = useGraphQLClient({
  apolloLink,
  gqlLink,
  typePolicies,
  persistStorage,
  apolloDefaultOptions
});
```

The GqlClient interface for configuring the hook looks like this:

```ts
export interface GqlClient {
  apolloLink: ApolloLink;
  gqlLink?: string;
  typePolicies?: TypePolicies;
  persistStorage?: PersistentStorage<string>;
  apolloDefaultOptions?: DefaultOptions;
}
```

The hook leverages persistent caching with apollo3-cache-persist and provides default storage using an MMKV-based class, ApolloPersistStorage.

## Code Generation

This package includes a code generation system to streamline the development process for both mobile and web applications. It generates TypeScript files for GraphQL queries, mutations, and hooks based on your schema and documents.

Run the following commands to generate the files in different environments:

```sh
yarn generate:dev
```
```sh
yarn generate:prod
```

The generation process involves creating TypeScript files (`base.ts`, `operations.ts`, `hooks.ts`, `types.ts`) in the `src/gql/__generated__` folder, which will be used in your application.

## Folder Structure

In the application for which the code generation is run, the src/gql folder must exist. Inside, you should create two sub-folders queries and mutations, where you can define your GraphQL documents, for example:

```ts
// src/gql/queries/example.ts
import { gql } from '@apollo/client';

export const getMyExampleQuery = gql`
  query getMyExample {
    example {
      getExample {
        example
      }
    }
  }
`;
```
After running the generation commands, the following files will be created in the `__generated__` folder:

- `base.ts`
- `operations.ts`
- `hooks.ts`
- `types.ts`

## Components

This package generates essential Apollo components for mobile and web applications.

## Environment Setup

To ensure the code generation works correctly, use the script define-app-root.sh to load environment variables based on the NODE_ENV (development or production).

```sh
chmod +x scripts/*.sh
NODE_ENV=development ./scripts/define-app-root.sh tsx ./src/codegen.ts
```

The script also validates the existence of the target folder and creates an `index.ts` file in the `gql` folder with the necessary exports.

## Feature Keywords

- apollo-client-hooks
- graphql-codegen

## Language and framework

- TypeScript
- GraphQL
- React
- Apollo Client

## Type

- Package

## Tech Category

- GraphQL

## Domain Category

- Common

## License

The `@dbbs/apollo-client` package is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- xomastyleee

## Links

[GraphQL](https://graphql.org/)
[Apollo Client](https://www.apollographql.com/)

## External dependencies

- @apollo/client
- @graphql-codegen/cli
- apollo3-cache-persist