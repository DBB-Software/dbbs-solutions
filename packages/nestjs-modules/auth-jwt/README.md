## Name: nestjs-module-authz

## Description

This authorization module is implemented to integrate JWT authentication functionalities into your NestJS applications. It allows seamless interaction with JWT-based authentication systems, ensuring secure and efficient user authentication.

## Usage

Install `@dbbs/nestjs-module-jwt-auth` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-auth-jwt
```

## Examples

To use nestjs-module-jwt-auth in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { AuthJwtModule } from '@dbbs/nestjs-module-auth-jwt'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [AuthJwtModule],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

The module is implemented according to best practices defined in jwt and NestJS documentation.

## Feature Keywords

- nestjs-jwt-integration
- auth-jwt

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

- andrii-dbb

## Links

[nestjs authentication](https://docs.nestjs.com/security/authentication)
[passport nestjs](https://docs.nestjs.com/recipes/passport)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- @nestjs/passport
- passport-jwt

