## Name: eslint-config

## Description

The eslint-config package provides custom eslint configurations for all js-based applications within dbbs-pre-built-solutions.

## Usage

Install `@dbbs/eslint-config` into your application using yarn.

```bash
yarn add @dbbs/eslint-config
```

## Examples

To utilize the eslint configuration provided by the eslint-config package, the required configuration in the `extends` field of the `.eslintrc` file within your application.

```json
{
  "root": true,
  "extends": ["@dbbs/eslint-config/node"]
}
```

## Features

- The package provides the configuration for node that applies back-end specific configurations
- The package provides the configuration for react that applies front-end specific configurations
- The package provides the configuration for react-native that applies mobile-app specific configurations

## Feature Keywords

- eslint-config-react
- eslint-config-react-native
- eslint-config-node

## Language and framework

- Node.js
- NestJS
- React
- Next.js
- React Native
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Back-end
- Front-end
- Mobile-app

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy
- dmitryhruzin

## Links

[Configure eslint](https://eslint.org/docs/latest/use/configure/)

## Relations

- /apps/*

## External dependencies

- eslint-config-turbo
