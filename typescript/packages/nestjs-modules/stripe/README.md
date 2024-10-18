## Name: nestjs-module-stripe

## Description

The Stripe Module for NestJS provides a comprehensive solution for integrating Stripe into your application. Built with NestJS in mind, this module simplifies the process of managing payments and interacting with the Stripe API. It features dynamic configuration and streamlined integration, ensuring a smooth and efficient setup for handling payment processing and related tasks.

## Usage

Install `@dbbs/nestjs-module-sentry` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-stripe
```

## Examples

To use nestjs-module-stripe in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRootAsync({
      apiKey: 'your-stripe-api-key'
    })
  ],
  controllers: [StripeController],
})
export class AppModule {}
```

## Features

- **Stripe Payment Integration for NestJS**: A NestJS module that simplifies integration with Stripe for payment processing. It offers dynamic configuration with ConfigModule, streamlined Stripe API interactions, easy integration into NestJS applications, and centralized management of API version and key.

## Feature Keywords

- nestjs-stripe-integration
- stripe-payment

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

- Danylo-Puchkov
- pxtterbl

## Links

- [Strapi GitHub repository](https://github.com/strapi/strapi)
- [Stripe documentation](https://docs.stripe.com/api?lang=node)
- [NestJS documentation](https://docs.nestjs.com/)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- nestjs-strapi
