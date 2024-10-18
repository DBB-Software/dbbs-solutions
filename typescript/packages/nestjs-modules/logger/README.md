## Name: nestjs-module-logger

## Description

The Logger Module for NestJS offers a powerful logging solution tailored for your application's needs. Built upon the NestJS Pino logger adapter, this module introduces custom features to enhance your logging experience.

## Usage

Install `@dbbs/nestjs-module-logger` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-logger
```

## Examples

To use nestjs-module-logger in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [LoggerModule.forRoot({ /* logger options */ }),],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

Some of the key features include:

- Requests Tracking: The module includes functionality for tracking requests, allowing you to monitor and log incoming requests effectively.
- Logs Transport to AWS S3 or AWS CloudWatch: With built-in support for AWS S3 and AWS CloudWatch, you can seamlessly transport logs to these storage solutions, enabling centralized logging and easy access to log data.
- Custom Implementation: The module provides a tailored implementation of the Pino logger, ensuring flexibility and extensibility to meet your specific logging requirements.

## Feature Keywords

- aws-s3-log-transport
- aws-cloudwatch-log-transport
- server-request-tracking
- serverless-request-tracking

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

[Nestjs pino GitHub](https://github.com/iamolegga/nestjs-pino)

## Relations

- /apps/server-api
- /apps/serverless-api
- /packages/s3-log-transport

## External dependencies

- nestjs-pino
- pino
