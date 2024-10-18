## Name: serverless-settings-service

## Description

The `serverless-settings-service` application serves as an example of a generated serverless application, ready for release, showcasing a basic starting point for web development projects.

As a typical example of a serverless application, the serverless-settings-service has been implemented. This service is essential in almost any multi-tenant system. It allows clients to retrieve settings for specific tenants from the settings storage.

## Usage

Generate a new serverless application using the following npx command.

```bash
npx turbo gen serverless-service
```

Invoke locally
```bash
npx serverless invoke local --function getSettings
```

## Features

The DBBS Pre-Built Solutions enables the generation of a serverless application template with opinionated settings. This simplifies and accelerates the initial stages of development while promoting code consistency across different applications. Additionally, it lays the groundwork for streamlining updates to the common aspects of applications when the pre-built solutions undergoes updates.

The `settings-service` application provides an endpoint for retrieving tenant settings in a multi-tenant system. The endpoint accepts a tenant ID, requests settings for the specified tenant from the ABC C3 service, and returns them to the client application. If the tenant ID is not provided, the service will return settings for all tenants.

## Feature Keywords

- serverless-service-bootstrap
- settings-service

## Language and framework

- Node.js
- JavaScript
- TypeScript
- Serverless

## Type

- Application

## Tech Category

- Back-end

## Domain Category

- Common
- multi-tenant-system

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- dmitryhruzin
- vks-dbb

## Links

[Serverless Framework Documentation](https://www.serverless.com/framework/docs)

[AWS Lambda](https://aws.amazon.com/lambda/)

## External dependencies

- aws-lambda
- @middy/*
