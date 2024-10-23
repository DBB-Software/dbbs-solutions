## Name: aspnet-server

## Description

The `aspnet-server` application serves as an example of a ASP.NET application, ready for release, showcasing a basic starting point for web development projects.

## Usage

Create database for the the ASP.NET application. As prerequisites `dotnet tool install --global dotnet-ef` should be installed beforehand.

```bash
dotnet ef database update
```

Run the ASP.NET application for development purposes using the following command.

```bash
npm run watch
```

or

```bash
npm run start:dev
```

Run the ASP.NET application on production.

```bash
npm run start
```

## Features

The DBBS Pre-Built Solutions enables the generation of a ASP.NET application. This simplifies and accelerates the initial stages of development while promoting code consistency across different applications. Additionally, it lays the groundwork for streamlining updates to the common aspects of applications when the pre-built solutions undergoes updates.

## Feature Keywords

- server-bootstrap-example

## Language and framework

- .NET
- C#

## Type

- Application

## Tech Category

- Back-end

## Domain Category

- Common
- admin-panel

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- vga-dbbs

## Links

[ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet) 

## External dependencies

- Swashbuckle
- Xunit
- coverlet
- NSubstitute
- FluentAssertions
