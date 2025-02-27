## Name: fast-api-db

## Description

This fast-api-db module provides integration of a PostgreSQL database connection into FastAPI application using SQLAlchemy package.

## Usage

Install `"fast-api-db` into your application using poetry.

```bash
poetry add ../../packages/fast-api-modules/sqlalchemy
```

## Examples
To use fast-api-db in FastAPI app, import it from the package and initialize in FastAPI application setup.

```python
# lifespan.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fast_api_db import setup_db


@asynccontextmanager
async def lifespan_setup(app: FastAPI) -> AsyncGenerator[None, None]:
    app.middleware_stack = None
    setup_db(app)
    app.middleware_stack = app.build_middleware_stack()
    yield
    await app.state.db_engine.dispose()

```

## Features
- Provide an AsyncSession with SQLAlchemy for handling asynchronous database operations.
- Supports PostgreSQL as database.
- Easy integration with FastAPI application.
- Centralized database connection. 


## Feature Keywords
- fast-api-db
- sqlalchemy
- postgresql


## Language and framework
- Python
- FastAPI


## Type
- Module


## Tech Category
- Back-end


## Domain Category
- Common


## License
The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).


## Authors and owners
- antonskazko


## Links
[SQLAlchemy guide for FastAPI](https://www.sqlalchemy.org/)


## Relations
- python/apps/fast-api-server


## External dependencies
- sqlalchemy
- fastapi
- asyncpg
