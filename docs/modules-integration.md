# Modules: Usage and Testing Guide

This document describes the process for adding, testing, and integrating internal modules from the modules folder in a Turborepo environment. These modules are designed to simplify development by offering reusable NestJS components that can be directly copied or installed as dependencies based on project requirements.

## Nestjs Modules

### Overview

The @dbbs/nestjs-modules package contains NestJS modules intended to streamline application development. While the package can be installed directly, its primary purpose is to allow modules to be copied into projects using a CLI during app generation.

---

### Adding a New Module

To add a new module to the @dbbs/nestjs-modules package:

#### 1. Create and Test the Module in a Test Application

- Add the module to the test application (e.g., @dbbs/server-api):

  - Create the module in the apps/server-api/src directory (or equivalent location).
  - Example module addition:
  
```typescript
    import { Module } from '@nestjs/common';
    import { ConfigModule } from '@nestjs/config';
    import { ExampleService } from './example.service.ts';
    import { ExampleController } from './example.controller.ts';
    
    @Module({
    imports: [ConfigModule],
    providers: [ExampleService],
    controllers: [ExampleController],
    })
    export class ExampleModule {}
```


- Run the test application:

  - Start the server to ensure the module works as expected:

    ```bash
    yarn start
    ```
    
  - Validate functionality by accessing the endpoints provided by the module or inspecting logs for expected behavior.
  

- Iterate and debug:
    
  - Update the module as necessary until it works correctly.

---

#### 2. Copy the Module to @dbbs/nestjs-modules

- Copy the module:

  - Move the newly created module to the packages/nestjs-modules/src directory.

- Install required dependencies:

  - Ensure all dependencies used in the module are added to the dependencies or devDependencies in the @dbbs/nestjs-modules package.

- Update package.json:

  - Ensure version alignment for dependencies between the test application and @dbbs/nestjs-modules.

    ```json
    "dependencies": {
        "@nestjs-modules/ioredis": "2.0.2",
        "@nestjs/common": "11.0.10",
        "@nestjs/config": "4.0.0",
        "@nestjs/mongoose": "10.1.0"
    }
    ```
- Export the module:

  - Add the module to the exports in the index.ts file:

    ```typescript
    export { ExampleModule } from './example/example.module.js';
    ```

- Build the package:
  
  - Compile the package:

    ```bash
    yarn build
    ```

---

#### 3. Test the Module in @dbbs/nestjs-modules

- Install @dbbs/nestjs-modules in the test application:

- Replace the local module with the package module:

  - Import the module from @dbbs/nestjs-modules:

  ```typescript
  import { ExampleModule } from '@dbbs/nestjs-modules';
  ```

- Run the application:

  - Start the server again to verify the module works identically to its local implementation.

- Validate module behavior:

  - Ensure all functionality remains consistent after integration with the @dbbs/nestjs-modules package.


### Usage in Applications

#### Copying Modules Using the CLI

When using the CLI for project generation:

- Copy the required module folder from @dbbs/nestjs-modules to your application.

- Add the module to the imports array in the application’s main module:

  ```typescript
  import { ExampleModule } from './example/example.module.js';

  @Module({
    imports: [ExampleModule],
  })
  export class AppModule {}
  ```
  
- Install required dependencies, if not already present.
