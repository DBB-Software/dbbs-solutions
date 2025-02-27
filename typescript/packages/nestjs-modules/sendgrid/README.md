## Name: sendgrid

## Description

The sendgrid service module provides a simple and efficient way to send emails using the SendGrid API. It allows you to integrate email functionality into your NestJS applications easily. With this service, you can manage and send emails reliably, leveraging the power of SendGrid for scalable and robust email delivery.

## Usage

Install `@dbbs/nestjs-module-sendgrid` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-sendgrid
```

## Examples

To use nestjs-module-sendgrid in the NestJS app import it from packages and provide to imports property of App Module.

```ts
// Providing in AppModule
import { SendgridModule } from '@dbbs/nestjs-module-sendgrid'
import { Module } from '@nestjs/common';

import { AppService } from './app.service.js'

@Module({
  imports: [SendgridModule],
  providers: [AppService]
})
export class AppModule {}
```

```ts
// Using in service

import { SendgridService } from '@dbbs/nestjs-module-sendgrid'
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly sendgridService: SendgridService) {}
  
  async someMethod() {
    // some logic

    const emailData = {
      to: 'recipient@example.com',
      subject: 'Your Subject Here',
      message: '<p>HTML version of your message</p>'
    }
    
    await this.sendgridService.sendEmail(emailData)
  }
}
```

## Features

- Email Sending with SendGrid: Easily send emails through SendGrid with validation for essential email fields, ensuring reliable delivery.

## Feature Keywords

- sendgrid-email-service

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

- pavlozhurbytskyi

## Links

[Sendgrid Node.js](https://github.com/sendgrid/sendgrid-nodejs)

## Relations

- typescript/apps/server-api
- typescript/apps/serverless-api

## External dependencies

- @sendgrid/mail
