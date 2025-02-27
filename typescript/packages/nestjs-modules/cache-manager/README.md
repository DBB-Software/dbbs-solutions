## Name: nestjs-module-cache-manager

## Description

The Cache Manager Module for NestJS offers a robust and scalable solution for managing caching in your application. Built on top of Redis, this module provides features for cache storage, retrieval, invalidation, and management with minimal configuration.

## Usage

Install `@dbbs/nestjs-module-cache-manager` into your application using yarn.

```bash
yarn add yarn add @dbbs/nestjs-module-cache-manager
```

## Examples

To use `nestjs-module-cache-manager` in your NestJS app, import it into the AppModule and provide necessary configurations via RedisModule:

```ts
import { CacheModule } from '@dbbs/nestjs-module-cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [CacheModule],
})
export class AppModule {}
```

Inject CacheManager into your service to manage cache operations like storing, retrieving, and invalidating data.

```ts
import { Injectable } from '@nestjs/common';
import { CacheManager } from '@dbbs/nestjs-module-cache-manager';

@Injectable()
export class ExampleService {
  constructor(private readonly cacheManager: CacheManager) {}

  async exampleUsage(): Promise<void> {
    // Set a value in the cache
    await this.cacheManager.set('key', { data: 'value' }, 3600);

    // Get the value from the cache
    const value = await this.cacheManager.get<{ data: string }>('key');
    console.log(value); // { data: 'value' }

    // Check if the key exists
    const exists = await this.cacheManager.exists('key');
    console.log('Key exists:', exists);

    // Delete the key from the cache
    await this.cacheManager.delete('key');
  }
}
```

## Features

Some of the key features include:

- Seamless Redis Integration: Built on top of @dbbs/nestjs-modules, allowing easy integration with Redis for high-performance caching.
- Flexible TTL Management: Support for setting expiration times for cache keys.
- Advanced Cache Operations:
- Invalidate cache keys by pattern.
- Reset entire cache.
- Extend TTL for existing keys.

## Feature Keywords

- redis-cache
- nestjs-cache
- cache-manager
- redis-integration
- ttl-management

## Language and framework

- Node.js
- NestJS
- JavaScript
- TypeScript

## Type

- Package

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
[NestJS Redis](https://docs.nestjs.com/microservices/redis)

## Relations

- /apps/server-api

## External dependencies

- @nestjs-modules/ioredis
- ioredis
- @nestjs/common
- @nestjs/config
