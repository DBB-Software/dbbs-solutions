## Name: dbbs-cli

## Description

The cli package contains number of tools for code generation and platform components.

## Installation

1. Install `@dbbs/cli` into your application globally using yarn.
```bash
yarn global add @dbbs/cli
```

## Usage

### Init Project

Once installed, you can run the CLI commands to initialize a new monorepo project:
```bash
dbbs-cli init <projectName>
```
This command will initialize a new project with the specified projectName and clone the necessary files to set up the basic structure of a monorepo.

#### Available parameters
| Parameter Name | Type   | Default Value | Description                                                                                                        |
|----------------|--------|---------------|--------------------------------------------------------------------------------------------------------------------|
| projectName    | string | none          | The name of the new project to be initialized. This will be used for directory creation and project configuration. |

### Add Package

```bash
dbbs-cli add-package <language> <packageName>
```
This command will install specified package to initialized project, package files will be saved to <projectDir>/<language>/packages.

#### Available parameters
| Parameter Name | Type   | Default Value | Description                                                                                |
|----------------|--------|---------------|--------------------------------------------------------------------------------------------|
| language       | string | none          | The programming language for the package. Choices are  py for Python or ts for TypeScript. |
| packageName    | string | none          | The name of the package to be added. This will be cloned from the GitHub repository.       |

### Generate App

```bash
dbbs-cli add-application <templateName>
```
This command will generate specified app into <cwd>/apps directory, and install required dependencies.

#### Available parameters
| Parameter Name | Type   | Default Value | Description                                                                                |
|----------------|--------|---------------|--------------------------------------------------------------------------------------------|
| templateName       | string | none          | Name of the template to generate. |

## Examples


## Features

## Feature Keywords

- cli
- code-generation

## Language and framework

- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Back-end
- Front-end

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- Roman Bobrovskiy


## External dependencies

- `yargs` - Used for parsing CLI arguments.
- `path` - Used for working with file and directory paths.