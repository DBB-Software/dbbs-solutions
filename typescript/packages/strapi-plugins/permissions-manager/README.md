# Strapi plugin: permissions-manager

## Description

The Permissions Manager plugin for Strapi is designed to manage user roles and permissions more effectively. It works in conjunction with the config-sync plugin to synchronize configurations, ensuring that any role and permission changes are consistently applied across environments.

## Usage

This plugin can be used in both manual and automated modes, allowing flexibility in how configurations are managed and applied.

### Prerequisites

First, you need to enable and configure the config-sync plugin along with the permissions-manager plugin in the plugins.ts file:

```ts
'config-sync': {
  enabled: true,
  config: {
  syncDir: 'config/sync/',
  destination: 'config/sync/',
  minify: false,
  soft: false,
  },
},
'permissions-manager': {
  enabled: true,
}
```

Ensure you have the necessary dependencies installed:

```bash
yarn add strapi-plugin-config-sync
yarn add @dbbs/strapi-plugin-permissions-manager
```

### Manual Usage

To manually export configurations, use the following command:

```bash
yarn config-sync export
```

This will export all configurations to the config/sync directory. Navigate to this directory to view the exported files.

For adding a role with custom permissions, locate the files that start with user-role.<role-name>.json in the config/sync directory. Here's an example of a role file:

```json
{
  "name": "manager",
  "description": "manager",
  "type": "manager",
  "permissions": [
    {
      "action": "plugin::test.custom.read"
    }
  ]
}
```

#### Field Descriptions
- name: The name of the role.
- description: A brief description of the role.
- type: The type of role.
- permissions: An array of permission objects. Each permission has an action string.

#### Understanding the Action Field
- plugin::: Refers to a plugin's permissions.
- api::: Refers to permissions related to the API.
- controller: Specifies a controller within a plugin or API.

For example, plugin::test.custom.read allows the read action on the custom route of the test plugin.

### Automated Usage
In automated mode, the plugin handles the import and export of configurations during Strapi's bootstrap and destroy lifecycle events.

- On Startup: The plugin imports configurations from the config/sync directory into the Strapi application.
- On Shutdown: The plugin exports the current configurations back to the config/sync directory.

### Dynamic Role and Permission Management

The plugin provides the ability to dynamically add roles and custom permissions without stopping the Strapi instance.

#### Example Request

To dynamically add permissions, send a POST request to /add-permissions with the following body:

```json
{
  "permissionsConfig": {
    "manager": [
      "plugin::test.custom.read",
      "plugin::test.custom.write"
    ],
    "editor": [
      "plugin::test.custom.read"
    ]
  }
}
```

### Sync Statuses
- only in DB: Configuration exists only in the database.
- diff: Configuration exists in both the database and the sync directory but has differences.
- only in Sync dir: Configuration exists only in the sync directory.

## Features

- Strapi Permissions management: Easily add or modify custom permissions in role configuration files.

## Feature Keywords

- strapi-permissions-management

## Language and framework

- Node.js
- Strapi
- JavaScript
- TypeScript

## Type

- strapi-plugin

## Tech Category

- strapi-plugin

## Domain Category

- common
- authorization-permissions

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- andrii-dbb

## Links

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.
- [Strapi GitHub repository](https://github.com/strapi/strapi)
- [Config-sync](https://github.com/pluginpal/strapi-plugin-config-sync)

## External dependencies

- @strapi/*
- react
- react-dom
- styled-components
