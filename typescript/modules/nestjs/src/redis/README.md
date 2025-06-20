## Name: nestjs-module-redis

## Description

The Redis Module for NestJS provides seamless integration with Redis, enabling high-performance caching and data management. This module leverages the powerful @nestjs-modules/ioredis package for robust and scalable Redis integration in your application.

## Usage

Install `@dbbs/nestjs-modules` into your application using yarn:

```bash
yarn add @dbbs/nestjs-modules
```

### Import and Configure RedisModule

To use `nestjs-module-redis` in your NestJS app, import it from `@dbbs/nestjs-modules` and include it in the imports array of your root module.

```ts
import { RedisModule } from '@dbbs/nestjs-modules';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule.forRootAsync()],
})
export class AppModule {}
```

### Configuration Example

Ensure you provide the required Redis connection details in your application's environment variables:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=default
REDIS_PASSWORD=yourpassword
```

## Features

Some of the key features include:

- Redis Integration: Provides seamless integration of Redis with NestJS applications, simplifying Redis-based data management and caching.
- Dynamic Configuration: Supports dynamic and environment-specific configuration through ConfigModule for flexible Redis setup.
- Connection Management: Optimizes connection handling with efficient pooling to support high-performance applications.
- Customizable Options: Allows customization of Redis options, such as host, port, username, password, and SSL, to meet application-specific requirements.
- Scalable Caching: Offers a strong foundation for implementing advanced caching strategies using Redis.
- Extensibility: Easily extendable to support additional Redis-based features like message queues, pub/sub systems, or real-time data pipelines.

## Feature Keywords

- redis-integration
- nestjs-redis
- redis-module
- caching

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

[Redis](https://redis.io/docs/latest/develop/)

## Relations

- /apps/server-api
- /packages/nestjs-module-cache-manager

## External dependencies

- @nestjs-modules/ioredis
- ioredis
- @nestjs/common
- @nestjs/config
