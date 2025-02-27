from typing import AsyncGenerator, Callable

import pytest
from unittest.mock import AsyncMock

from fastapi import FastAPI
from fast_api_db import setup_db, get_db_session
from fast_api_db.settings import settings


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    """Fixture to define asynchronous backend for test"""
    return "asyncio"


@pytest.fixture
def set_test_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    """Fixture to configure the database connection for testing"""
    test_connection_uri = "postgresql+asyncpg://demo:demo@127.0.0.1:5432/postgres"
    monkeypatch.setattr(settings, "connection_uri", test_connection_uri)
    monkeypatch.setattr(settings, "echo", True)


@pytest.fixture
async def app(set_test_settings: None) -> FastAPI:
    """Fixture to initialize the FastAPI app and database setup"""
    app = FastAPI()
    setup_db(app)
    return app


@pytest.fixture
def mock_db_session() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def override_get_db_session(mock_db_session: AsyncMock) -> Callable[[], AsyncGenerator[AsyncMock, None]]:
    """Fixture to override the database session dependency"""

    async def _override_get_db_session() -> AsyncGenerator[AsyncMock, None]:
        yield mock_db_session

    return _override_get_db_session


@pytest.fixture
async def app_with_overrides(app: FastAPI, override_get_db_session: AsyncMock) -> FastAPI:
    """Fixture to provide an app instance with overridden dependencies"""
    app.dependency_overrides[get_db_session] = override_get_db_session
    return app
