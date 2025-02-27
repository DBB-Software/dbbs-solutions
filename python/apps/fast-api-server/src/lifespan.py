from fastapi import FastAPI
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fast_api_db import setup_db


@asynccontextmanager
async def lifespan_setup(
    app: FastAPI,
) -> AsyncGenerator[None, None]:  # pragma: no cover
    """
    Actions to run on application startup.
    This function uses fastAPI app to store data
    in the state, such as db_engine.
    :param app: the fastAPI application.
    :return: function that actually performs actions.
    """
    app.middleware_stack = None
    setup_db(app)
    app.middleware_stack = app.build_middleware_stack()
    yield
    await app.state.db_engine.dispose()
