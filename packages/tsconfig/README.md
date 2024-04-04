## Name: tsconfig

## Description

The tsconfig package provides custom TypeScript configurations for all ts-based applications within dbbs-platform.

## Usage

Install `@dbbs/tsconfig` into your application using yarn.

```bash
yarn add @dbbs/tsconfig
```

## Examples

To make use of the TypeScript configuration provided by the tsconfig package, extend your application's configuration from it within the tsconfig.json file.

```json
{
  "extends": "@dbbs/tsconfig/react-native.json",
  "compilerOptions": {},
  "references": []
}
```

## Features

The package provides configurations for all types of application with appropriate `module` and `moduleResolution` options for each application.

## Feature Keywords

- tsconfig-base
- tsconfig-nestjs
- tsconfig-nextjs
- tsconfig-react-library
- tsconfig-react-native
- tsconfig-react-spa

## Language and framework

- Node.js
- NestJS
- React
- Next.js
- React Native
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

[What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## Relations

- /apps/* 

## External dependencies

N/A
