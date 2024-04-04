## Name: s3-log-transport

## Description

The s3-log-transport module offers a streamlined solution for capturing logs from the standard output (stdout) of an application and efficiently storing them in a designated Amazon S3 bucket. With this package, you can easily manage and preserve your application logs, ensuring reliability and accessibility for monitoring and analysis purposes.

## Usage

Install `@dbbs/s3-log-transport` into your application using yarn.

```bash
yarn add @dbbs/s3-log-transport
```

## Examples

To use s3-log-transport in the node app specify the package as target for transports in Pino logger options, alongside with AWS environment.

```ts
pinoHttp: {
  transport: {
    targets: [
      {
        target: '@dbbs/s3-log-transport',
        options: {
          region: AWS_S3_LOGS_REGION,
          uploadInterval: LOGS_UPLOAD_INTERVAL_MS,
          batchSize: LOGS_BUTCH_SIZE,
          bucket: AWS_S3_LOGS_BUCKET,
          folder: AWS_S3_LOGS_FOLDER
        }
      }
    ]
  }
}
```

## Features

- Logs Transport to AWS S3: With built-in support for AWS S3, you can seamlessly transport logs to these storage solutions, enabling centralized logging and easy access to log data.

## Feature Keywords

- aws-s3-log-transport

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

[Amazon S3 Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)

[Pino docs. Transports](https://github.com/pinojs/pino/blob/HEAD/docs/transports.md)

## Relations

- /apps/server-api
- /apps/serverless-api
- /packages/nestjs-modules/logger

## External dependencies

- @aws-sdk/client-s3
