## Name: poeditor-sdk

The poeditor-sdk package provides a simple and efficient way to interact with the POEditor API using TypeScript. It includes built-in support for managing projects, languages, terms, and translations, making it easy to integrate localization management into your application.

## Usage

Install @dbbs/poeditor-sdk into your application using Yarn.

```bash
yarn add @dbbs/poeditor-sdk
```

## Examples
Import the POEditorSDK and use it:

```tsx
import { POEditorSDK } from '@dbbs/poeditor-sdk';

const sdk = new POEditorSDK('your-api-token', 123456);

// List all projects
const projects = await sdk.listProjects();

// Add a new language to a project
await sdk.addLanguageToProject({ language: 'es' });

// Sync project terms
await sdk.syncTerms({ terms: [{ term: 'hello', context: 'greeting' }] });
```

## Available Methods

### **Project Management**
- `listProjects()`
- `viewProject()`
- `syncTerms(payload)`
- `exportProject(payload)`

### **Language Management**
- `listAvailableLanguages()`
- `listProjectLanguages()`
- `addLanguageToProject(payload)`

### **Term Management**
- `listTerms(payload)`
- `addTerms(payload)`
- `updateTerms(payload)`
- `deleteTerms(payload)`

### **Translation Management**
- `addTranslation(payload)`
- `updateTranslation(payload)`
- `deleteTranslation(payload)`

## Features

- Project Management: Manage POEditor projects, sync terms, and export translations.
- Language Support: Retrieve available languages, manage project languages.
- Term Management: Add, update, and delete translation terms.
- Translation Handling: Add, update, and delete translations for different languages.

## Feature Keywords

- poeditor-sdk
- localization
- translation-management

## Language

- Typescript

## Type

- Package

## Tech Category

- Back-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- Rostyslav Zahorulko

## Links

[POEditor API Documentation](https://poeditor.com/docs/api)

## External dependencies

- jest-fetch-mock