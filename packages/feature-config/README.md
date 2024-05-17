## Name: feature-config

## Description

The feature-config package provides a service that aggregates feature flags. It offers an in-memory storage implementation for feature flags and can accept custom implementations such as Statsig, Firebase, etc.

## Usage

Install `@dbbs/feature-config` into your application using yarn.

```bash
yarn add @dbbs/feature-config
```

## Examples

To utilize the FeatureFlagService provided by the feature-config package, import it and use `isEnabled` method with appropriate Feature Name.

```ts
import { FeatureFlagService, FeatureFlags } from '@dbbs/feature-config'

const featureFlagService = new FeatureFlagService()

if (featureFlagService.isEnabled(FeatureFlags.FEATURE_NAME)) {
  // ...
}
```

## Features

The feature flag service can be utilized across any type of application to retrieve information about whether a specific feature flag is enabled or not. This enables dynamically altering the system's logic without the need for redeployment.

## Feature Keywords

- feature-flag-service

## Language and framework

- Node.js
- NestJS
- React
- Next.js
- React Native
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Back-end
- Front-end
- Mobile-app

## Domain Category

- Common

## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- vks-dbb
- dmitryhruzin

## Links

[Feature Toggles (aka Feature Flags)](https://martinfowler.com/articles/feature-toggles.html)

## Relations

- /apps/*

## External dependencies

N/A
