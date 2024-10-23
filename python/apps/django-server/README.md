## Name: django-server

## Description

The `django-server` application serves as an example of a generated Django application, ready for release, showcasing a basic starting point for web development projects.

## Usage

Generate a new Django application using the following npx command.

```bash
npx turbo gen django-server
```

Run created Django application to create sqlite3 DB (if you are using it) using the following command.

```bash
target=django-server yarn dev
```

Run migrate command to migrated DB scheme to the latest version using the following command.

```bash
target=django-server yarn migrate
```

## Features

The DBBS Pre-Built Solutions enables the generation of a Django application template with opinionated settings. This simplifies and accelerates the initial stages of development while promoting code consistency across different applications. Additionally, it lays the groundwork for streamlining updates to the common aspects of applications when the pre-built solutions undergoes updates.

## Feature Keywords

- django-server-bootstrap

## Language and framework

- Python
- Django
- Django Rest Framework

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

- bilenko-ha1305
- ArtemBrytan

## Links

[Django documentation](https://docs.djangoproject.com/en/5.0/) \
[Django REST Framework documentation](https://www.django-rest-framework.org/)

## External dependencies

- Django
- djangorestframework
- djangorestframework-simplejwt
- gunicorn
- django-debug-toolbar
- django-extensions
- python-dotenv
- psycopg2
- setuptools
- coverage
- whitenoise
- ruff
- django-health-check
