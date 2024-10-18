## Name: nestjs-module-healthcheck

## Description

This module provides a health check functionality for seamless integration into your NestJS application. It allows you to monitor the health of your application, making it ideal for various purposes such as monitoring, Pingdom integration, or building status pages.

## Usage

Install `@dbbs/nestjs-module-healthcheck` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-healthcheck
```

## Examples

To use nestjs-module-healthcheck in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { HealthcheckModule } from '@dbbs/nestjs-module-healthcheck'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [HealthcheckModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

The module does not require any additional dependencies.

## Feature Keywords

- no-dependencies

## Language and framework

- Node.js
- NestJS
- JavaScript
- TypeScript

## Type

- Module

## Tech Category

- Back-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- dmitryhruzin
- vks-dbb

## Links

[N/A]

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

[N/A]
