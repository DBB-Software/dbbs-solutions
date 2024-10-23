## Name: sendgrid

## Description

The sendgrid service module provides a simple and efficient way to send emails using the SendGrid API. It allows you to integrate email functionality into your Node.js applications easily. With this service, you can manage and send emails reliably, leveraging the power of SendGrid for scalable and robust email delivery.

## Usage

Install `@dbbs/sendgrid` into your application using yarn.

```bash
yarn add @dbbs/sendgrid
```

## Examples

To use s3-log-transport in the node app specify the package as target for transports in Pino logger options, alongside with AWS environment.

```ts
import { SendgridService } from '@dbbs/sendgrid'

const sendgridService = new SendgridService(process.env.SENDGRID_API_KEY)

const emailData = {
  recipientEmail: 'recipient@example.com',
  senderEmail: 'sender@example.com',
  subject: 'Your Subject Here',
  text: 'Plain text version of your message',
  message: '<p>HTML version of your message</p>'
}

try {
  await sendgridService.sendEmail(emailData)
}
catch (err) {
  console.error('Error sending email:', error)
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

- vks-dbb

## Links

[Sendgrid Node.js](https://github.com/sendgrid/sendgrid-nodejs)

## Relations

- /apps/server-api
- /apps/serverless-api
- /apps/strapi

## External dependencies

- @sendgrid/mail
