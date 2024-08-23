## Name: nestjs-module-settings

## Description

The Settings Module for NestJS offers a robust solution for managing tenant-specific settings within your application. It leverages the NestJS ClsModule for context management and the LoggerModule for enhanced logging capabilities.

## Usage

Install `@dbbs/nestjs-module-settings` into your application using yarn.

```bash
yarn add @dbbs/nestjs-module-settings
```

## Examples

To use the nesjs-settings-module module in your NestJS application, import it from the package and specify it in the imports property of your application module, along with this you need to specify the clsStorageName of your ClsModule so that the setting service understands which one storage to take the data from.

```ts
import { SettingsModule } from '@dbbs/nestjs-module-settings'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls) => {
          cls.set('YOUR_CLS_STORAGE_NAME', asyncContextStorage.getStore())
        }
      }
    }),
    SettingsModule.forRoot({ clsStorageName: 'YOUR_CLS_STORAGE_NAME' })
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
```

## Features

Some of the key features include:

- Tenant Settings Management: Manage settings for multiple tenants with ease, allowing for tenant-specific configurations and customization.
- Context Management: Utilizes the nestjs-cls module to manage async context, ensuring proper handling of tenant-specific settings across various requests.
- Enhanced Logging: Integrates with @dbbs/nestjs-module-logger to provide detailed logging capabilities, including request tracking and custom log transports.

## Feature Keywords

- tenant-settings-management
- async-context-management
- enhanced-logging

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
- multi-tenant-system

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- vks-dbb

## Links

[Nestjs Async Local Storage](https://docs.nestjs.com/recipes/async-local-storage)

## Relations

- /apps/server-api
- /apps/serverless-api
## External dependencies

- nestjs-cls
