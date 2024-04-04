## Name: nestjs-module-health

## Description

This module provides a health check functionality for seamless integration into your NestJS application. It allows you to monitor the health of your application, making it ideal for various purposes such as monitoring, Pingdom integration, or building status pages.

## Usage

Install `@dbbs/nestjs-module-health` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-health
```

## Examples

To use nestjs-module-health in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { HealthModule } from '@dbbs/nestjs-module-health'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

The module is implemented according to best practices defined in NestJS documentation. 

## Feature Keywords

- nestjs-documented-approach

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

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- dmitryhruzin
- vks-dbb

## Links

[Healthchecks (Terminus)](https://docs.nestjs.com/recipes/terminus)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- @nestjs/terminus
