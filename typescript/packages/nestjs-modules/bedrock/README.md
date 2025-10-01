## Name: nestjs-module-bedrock

## Description

The Bedrock Module for NestJS offers a comprehensive AI integration solution tailored for your application's needs. Built upon the AWS Bedrock SDK and LangChain, this module seamlessly integrates with NestJS to provide advanced features for AI chat capabilities and text generation, enhancing your application's intelligence and user experience.

## Usage

Install `@dbbs/nestjs-module-bedrock` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-bedrock
```

## Examples

To use nestjs-module-bedrock in the NestJS app import it from packages and provide to imports property of App Module.

```ts
import { BedrockModule } from '@dbbs/nestjs-module-bedrock'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [BedrockModule,],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

```ts
import { Module, Injectable } from '@nestjs/common';
import { BedrockModule } from './bedrock.module';
import { BedrockService } from '@dbbs/nestjs-module-bedrock';

@Module({
  imports: [
    BedrockModule,
  ],
})
export class AppModule {}

@Injectable()
export class SomeService {
  constructor(private readonly bedrockService: BedrockService) {}

  async generateResponse(promptText: string, input: string): Promise<string> {
    const response = await this.bedrockService.generate(promptText, input);
    return response.output;
  }
}
```

## Features

Some of the key features include:

- AI Chat Integration: The module provides comprehensive AI chat capabilities, allowing you to integrate AWS Bedrock language models into your application.
- Custom Configuration: Easily configure Bedrock with environment variables to suit your specific AI model needs and AWS credentials.
- Dynamic Module: The module can be dynamically imported and configured, providing flexibility in how you set up and use AWS Bedrock in your application.

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

- bilenko-ha1305

## Links

[AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)

## Relations

- typescript/apps/server-api
- typescript/apps/serverless-api

## External dependencies

- @langchain/aws
