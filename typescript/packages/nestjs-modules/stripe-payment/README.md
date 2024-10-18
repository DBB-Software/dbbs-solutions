## Name: nestjs-module-stripe-payment

## Description

The StripePayment module for NestJS provides a comprehensive solution for integrating Stripe and managing related entities in the database. In addition to interacting with the Stripe API for handling payments, the module performs data management operations both in Stripe and in the database, ensuring full synchronization between them. This allows you not only to manage payments but also to keep your application's data up-to-date, ensuring consistency between Stripe and the database. Payment system integration with Stripe is facilitated through the related package "@dbbs/nestjs-module-stripe".

## Usage

Install `@dbbs/nestjs-module-stripe-payment` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-stripe-payment
```

## Examples

To use nestjs-module-stripe-payment in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';
import { StripePaymentModule } from './stripe-payment.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripePaymentModule,
    RouterModule.register([
      {
        path: 'stripe-payment',
        module: StripePaymentModule
      }
    ]),
  ],
  controllers: [StripeController],
})
export class AppModule {
}
```

## Features

- **Stripe Payment Integration for NestJS**: A NestJS module that simplifies integration with Stripe for payment processing. It offers dynamic configuration with ConfigModule, streamlined Stripe API interactions, easy integration into NestJS applications, and centralized management of API version and key.

## Feature Keywords

- nestjs-stripe-payment-integration
- stripe-payment-crud-api

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

- alexkhokholkov

## Links

- [Strapi GitHub repository](https://github.com/strapi/strapi)
- [Stripe documentation](https://docs.stripe.com/api?lang=node)
- [NestJS documentation](https://docs.nestjs.com/)

## Relations

- /apps/server-api
- /apps/serverless-api

## External dependencies

- nestjs-strapi 
- @dbbs/common 
- @dbbs/feature-config
- @dbbs/nestjs-module-stripe
- @dbbs/nestjs-module-logger
