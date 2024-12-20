## Name: nestjs-module-logger

## Description

The Sentry Module for NestJS offers a comprehensive monitoring and error-tracking solution tailored for your application's needs. Built upon the Sentry SDK, this module seamlessly integrates with NestJS to provide advanced features for capturing and tracking errors, enhancing your application's reliability and maintainability.
## Usage

Install `@dbbs/nestjs-module-sentry` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-sentry
```

## Examples

To use nestjs-module-sentry in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { SentryModule } from '@dbbs/nestjs-module-sentry'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [SentryModule.forRoot({ /* logger options */ }),],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

```ts
import { Module, Inject } from '@nestjs/common';
import { SentryModule } from './sentry.module';
import * as Sentry from '@sentry/node';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'your-sentry-dsn',
      // other Sentry options
    }),
  ],
})
export class AppModule {}

@Injectable()
export class SomeService {
  constructor(@Inject('SENTRY_PROVIDER') private readonly sentry: typeof Sentry) {}

  logError(error: any) {
    this.sentry.captureException(error);
  }
}
```

## Features

Some of the key features include:

- Global Error Tracking: The module provides centralized error tracking, allowing you to monitor and log errors from all parts of your application.
- Custom Configuration: Easily configure Sentry with custom options to suit your specific monitoring needs.
- Dynamic Module: The module can be dynamically imported and configured, providing flexibility in how you set up and use Sentry in your application.

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

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- Danylo-Puchkov
- alexkhokholkov

## Links

[Nestjs pino GitHub](https://github.com/iamolegga/nestjs-pino)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- nestjs-sentry
