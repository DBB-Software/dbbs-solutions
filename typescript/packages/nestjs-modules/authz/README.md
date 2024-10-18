## Name: nestjs-module-authz

## Description

This authorization module is implemented following the best practices outlined in the Auth0 NestJS documentation. It provides seamless integration of JWT-based authentication and role-based access control (RBAC) into your NestJS applications. With this module, you can secure routes and controllers by enforcing access based on user authentication and roles, ensuring that only authorized users can access protected resources. The module also allows you to configure public routes, making it flexible for handling both authenticated and open access within your application, while maintaining robust security measures.

## Usage

Install `@dbbs/nestjs-module-authz` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-authz
```

## Examples

To use `nestjs-module-authz` in your NestJS application, import it from the package and add it to the `imports` array of the AppModule. This module provides JWT-based authentication and role-based access control (RBAC) for your routes and controllers.

### Example of importing and setting up the module

```ts
import { AuthzModule } from '@dbbs/nestjs-module-authz';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [AuthzModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Example of securing routes with role-based access control

You can secure specific routes or entire controllers using decorators that enforce access based on user roles. The following example demonstrates how to protect routes for authenticated users and admins:

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { Authenticated, Admin, Public } from '@dbbs/nestjs-module-authz';  // Import decorators for role-based access control
import { ExampleService } from './example.service.js';

@UseGuards(AuthGuard('jwt')) // Added jwt strategy to validate auth0 users
@Controller('/examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/:id')
  @Authenticated() // Allows access to authenticated users (both 'user' and 'admin')
  async getExample(@Param('id') id: string) {
    return this.exampleService.getExample(id);
  }

  @Get('/admin/:id')
  @Admin() // Restricts access to admins only
  async getAdminExample(@Param('id') id: string) {
    return this.exampleService.getAdminExample(id);
  }

  @Get('/public/:id')
  @Public() // Allows open access (no authentication required)
  async getPublicExample(@Param('id') id: string) {
    return this.exampleService.getPublicExample(id);
  }
}
```

## Features

The module is implemented according to best practices defined in Auth0 NestJS documentation. 

## Feature Keywords

- auth0-nestjs-adapter
- auth0-nestjs-guard
- auth0-authorization
- auth0-authentication

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
- andrii-dbb

## Links

[Auth0 documentation for NestJS](https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- @nestjs/passport
- jwks-rsa
- passport-jwt
