from typing import AsyncGenerator

import warnings
from fastapi import FastAPI
from starlette.requests import Request
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from fast_api_db.settings import settings


async def get_db_session(request: Request) -> AsyncGenerator[AsyncSession, None]:
    """
    Create and get database session.
    :param request: current request.
    :yield: database session.
    """
    session: AsyncSession = request.app.state.db_session_factory()

    try:
        yield session
    finally:
        await session.commit()
        await session.close()


def setup_db(app: FastAPI) -> None:  # pragma: no cover
    """
    Creates connection to the database.
    This function creates SQLAlchemy engine instance,
    session_factory for creating sessions
    and stores them in the application's state property.
    :param app: fastAPI application.
    """
    if not settings.connection_uri:
        warnings.warn("Warning: no connection uri set.", UserWarning)
        return

    engine = create_async_engine(
        settings.connection_uri,
        echo=settings.echo,
    )
    session_factory = async_sessionmaker(
        engine,
        expire_on_commit=False,
    )
    app.state.db_engine = engine
    app.state.db_session_factory = session_factory
