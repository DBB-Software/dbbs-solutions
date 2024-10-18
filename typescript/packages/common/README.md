## Name: common

## Description

The common package contains number of tools for server development such as error wrappers, aws client wrappers, serverless middlewares, etc.

## Usage

Install `@dbbs/common` into your application using yarn.

```bash
yarn add @dbbs/common
```

## Examples

To use tools from common package in the node app import it. For instance, in case of `HttpExceptionFilter` it should be extracted and provided to the `useGlobalFilters` method of a NestJS application.

```ts
import { HttpExceptionFilter } from '@dbbs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT || 8000)
}
bootstrap()
```

## Features

- AWS Client Wrappers: These wrappers simplify the usage of AWS SDK for DynamoDB, Event Bridge, Lambda, S3, SNS, SES, and SQS services across DBBS applications.
- Settings Service Client: This service facilitates managing tenant settings in a multi-tenant system. It provides the capability to retrieve settings for all tenants or for a specific one. It caches settings to enhance performance using LRUCache.
- Error Wrappers: A collection of frequently used errors, such as AuthError, ArgumentError, NotFoundError, etc., with preset HTTP status codes.
- HTTP Exception Filter: An error handler configured for Nest.js applications.
- Serverless Logger Middleware: A proxy function for injecting a logger into serverless applications.
- Serverless Settings Middleware: A proxy function for injecting tenant settings into serverless applications.

## Feature Keywords

- aws-client-wrapper-dynamodb
- aws-client-wrapper-event-bridge
- aws-client-wrapper-lambda
- aws-client-wrapper-s3
- aws-client-wrapper-sns
- aws-client-wrapper-sqs
- aws-client-wrapper-ses
- settings-service-client
- error-wrapper
- http-exception-filter
- serverless-logger-middleware
- serverless-settings-middleware

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

- asa-dbb
- dmitryhruzin
- vks-dbb

## Links

[Amazon DynamoDB Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-examples.html)

[Amazon EventBridge Node.js](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-tutorial-get-started.html)

[Amazon Lambda Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-samples.html)

[Amazon S3 Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)

[Amazon Simple Notification Service Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples.html)

[Amazon SQS Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples.html)

[Amazon SES Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples.html)

[Pino documentation](https://github.com/pinojs/pino/tree/master/docs)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- @aws-sdk/client-dynamodb
- @aws-sdk/client-eventbridge
- @aws-sdk/client-lambda
- @aws-sdk/client-s3
- @aws-sdk/client-sns
- @aws-sdk/client-sqs
- @aws-sdk/client-ses
- @aws-sdk/util-utf8-node
- @middy/core
- pino
- typescript-lru-cache
