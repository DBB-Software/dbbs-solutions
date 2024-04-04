## Name: jest-config

## Description

The jest-config package provides custom jest configurations for all js-based applications within dbbs-platform.

## Usage

Install `@dbbs/jest-config` into your application using yarn.

```bash
yarn add @dbbs/jest-config
```

## Examples

To utilize the Jest configuration provided by the jest-config package, import it into the jest.config.ts file of your application and incorporate it within the export function.

```ts
import { nodeConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...nodeConfig
})
```

## Features

- The package provides base config with common settings across back-end, front-end and mobile app
- The package provides an override of the base configuration for node that applies back-end specific configurations
- The package provides an override of the base configuration for web-ssr that applies front-end ssr specific configurations
- The package provides an override of the base configuration for web-spa that applies front-end spa specific configurations

## Feature Keywords

- jest-config-base
- jest-config-web-ssr
- jest-config-web-spa
- jest-config-node

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

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- RomanBobrovskiy
- dmitryhruzin

## Links

[Configuring Jest](https://jestjs.io/docs/configuration)

## Relations

- /apps/* 

## External dependencies

N/A
