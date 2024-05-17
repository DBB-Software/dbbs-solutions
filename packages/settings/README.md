## Name: settings

## Description

The package comprises templates for configuring tenant settings across various environments within a multi-tenant system.

## Usage

Commit settings file and upload to s3 bucket. Use the settings file as a context for your application.

## Examples

To upload the settings file to s3 bucket use the following command:

```shell
aws s3 cp development/settings.json s3://dbbs-settings-development/settings.json
```

Upload settings for local development
```shell
awslocal s3api create-bucket --bucket dbbs-settings-local --create-bucket-configuration LocationConstraint=eu-central-1
awslocal s3 cp local/settings.json s3://dbbs-settings-local/settings.json
```

## Features

The package offers template settings tailored for various environments within a multi-tenant system.

## Feature Keywords

- multi-tenant-settings

## Language and framework

- *

## Type

- Package

## Tech Category

- Back-end
- Front-end
- Mobile-app

## Domain Category

- multi-tenant-system

## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- asa-dbb
- vks-dbb

## Links

[AWS S3 CLI](https://docs.aws.amazon.com/cli/latest/reference/s3/)

## Relations

- /apps/*

## External dependencies

N/A
