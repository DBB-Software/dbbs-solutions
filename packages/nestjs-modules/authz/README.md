## Name: nestjs-module-authz

## Description

This authorization module is implemented following the best practices outlined in the Auth0 NestJS documentation. With this module, you can seamlessly integrate authorization functionalities into your NestJS applications, ensuring robust security measures are in place.

## Usage

Install `@dbbs/nestjs-module-authz` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-authz
```

## Examples

To use nestjs-module-authz in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [AuthzModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

The module is implemented according to best practices defined in Auth0 NestJS documentation. 

## Feature Keywords

- nestjs-documented-approach
- auth0-nestjs-adapter

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

[Auth0 documentation for NestJS](https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- @nestjs/passport
- jwks-rsa
- passport-jwt
