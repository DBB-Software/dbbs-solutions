## Name: nestjs-module-database

## Description

The Database Module for NestJS offers a robust solution for managing any database connections within your application.

## Usage

Install `@dbbs/nestjs-module-database` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-database
```

## Examples

To use the nesjs-settings-module module in your NestJS application, import it from the package and specify it in the imports property of your application module, along with this you need to specify the clsStorageName of your ClsModule so that the setting service understands which one storage to take the data from.
If the client or connection options are not provided, you can specify them using environment variables. The module will automatically pick up the following variables:

DATABASE_CLIENT: Specifies the database client to be used (e.g., pg, mysql, sqlite3).
DATABASE_URL: Specifies the database connection URL.

```ts
import { DatabaseModule } from '@dbbs/nestjs-module-database'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [
    DatabaseModule.forRoot({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './data.db'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

Some of the key features include:

- Knex.js Integration: Seamlessly integrates Knex.js with your NestJS application, allowing for powerful SQL query building and database management.
- Dynamic Configuration: Easily configure the module to fit your specific database setup, supporting various database clients like PostgreSQL, MySQL, and SQLite.
- Global Module: The module can be globally configured, providing a single source of database connection throughout the application.

## Feature Keywords

- database-management-knex

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

- vks-dbb

## Links

[Knex JS](https://knexjs.org/guide/)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- nestjs-knex
- knex
