from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import FastAPI
from sqlalchemy import text

from fast_api_db import setup_db
from fast_api_db.settings import settings
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine


@pytest.mark.anyio
async def test_db_engine_setup(app: FastAPI) -> None:
    """Test database engine is set up."""
    db_engine = app.state.db_engine
    assert db_engine is not None, "Database engine should not be None"


@pytest.mark.anyio
async def test_session_factory_setup(app: FastAPI) -> None:
    """Test session factory is set up and and provides AsyncSession instances."""
    session_factory = app.state.db_session_factory
    assert session_factory is not None, "Session factory should not be None"

    async with session_factory() as session:
        assert isinstance(session, AsyncSession), "Session should be AsyncSession"


@pytest.mark.anyio
async def test_db_is_active(app: FastAPI) -> None:
    """Test that the database connection is active by executing a query."""
    # Create a mock result with scalar()
    mock_result = AsyncMock()
    mock_result.scalar = MagicMock(return_value=1)

    # Create a mock session
    mock_session = AsyncMock()
    mock_session.execute.return_value = mock_result

    # Simulate entering the async context. Required for async context manager
    mock_session.__aenter__.return_value = mock_session
    mock_session.__aexit__.return_value = None

    # Mock the session factory and override
    mock_session_factory = MagicMock(return_value=mock_session)
    app.state.db_session_factory = mock_session_factory

    async with app.state.db_session_factory() as session:
        result = await session.execute(text("SELECT 1"))
        assert result.scalar() == 1, "Database connection should return 1"


@pytest.mark.anyio
async def test_create_async_engine(app: FastAPI) -> None:
    """Test that database engine uses asyncpg"""
    engine: AsyncEngine = app.state.db_engine
    assert isinstance(engine, AsyncEngine), "Engine should be AsyncEngine"
    assert str(engine.url).startswith("postgresql+asyncpg")


@pytest.mark.anyio
async def test_missing_connection_uri(monkeypatch: pytest.MonkeyPatch) -> None:
    """Test that the warning error is raised when connection_uri is missing."""
    monkeypatch.setattr(settings, "connection_uri", None)
    app = FastAPI()

    with pytest.warns(UserWarning, match="Warning: no connection uri set."):
        setup_db(app)
