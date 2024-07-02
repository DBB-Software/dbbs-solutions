## Name: nestjs-strapi-roles

## Description

The Strapi Roles Module for NestJS offers a robust solution for managing user roles and permissions via Strapi. This module integrates seamlessly with CASL to provide fine-grained access control, leveraging Strapi's user roles and permissions system.

## Usage

Install `@dbbs/nestjs-module-strapi-roles` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-strapi-roles
```

## Examples

To use nestjs-strapi-roles in a NestJS application, import it into your app module and provide it in the imports property.

```ts
import { StrapiRolesModule } from 'nestjs-strapi-roles';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [StrapiRolesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

## Features

- Custom Decorator and Guard: The module allows you to apply a custom decorator and guard to routes, ensuring that users have the required permissions in Strapi.
- CASL Integration: Integrates with CASL for powerful and flexible access control.
- Permissions Caching: Utilizes an LRU cache to store permissions, reducing the number of requests to Strapi.
- Centralized Permissions Management: Centralizes the management of permissions, making it easier to update and maintain.

## Feature Keywords

- strapi-role-management
- casl-access-control
- permissions-caching
- user-permissions

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

- andrii-dbb

## Links

[Casl GitHub](https://github.com/stalniy/casl)

## Relations

## External dependencies

- @nestjs/axios
- @nestjs/config
- casl
- lru-cache

