
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import create_async_engine

from src.settings import settings


def try_cast_int(value):
    try:
        return int(value)
    except ValueError:
        return value


map_filter_db = {
    "equals": lambda field, value: field == try_cast_int(value),
    "!=": lambda field, value: field != try_cast_int(value),
    "<": lambda field, value: field < try_cast_int(value),
    "<=": lambda field, value: field <= try_cast_int(value),
    ">": lambda field, value: field > try_cast_int(value),
    ">=": lambda field, value: field >= try_cast_int(value),
    "contains": lambda field, value: field.ilike(f"%{str(value)}%"),  # Always a string for `contains`
}


async def drop_database() -> None:
    """Drop current database."""
    db_url = make_url(str(settings.db_url.with_path("/postgres")))
    engine = create_async_engine(db_url, isolation_level="AUTOCOMMIT")
    async with engine.connect() as conn:
        disc_users = (
            "SELECT pg_terminate_backend(pg_stat_activity.pid) "  # noqa: S608
            "FROM pg_stat_activity "
            f"WHERE pg_stat_activity.datname = '{settings.db_base}' "
            "AND pid <> pg_backend_pid();"
        )
        await conn.execute(text(disc_users))
        await conn.execute(text(f'DROP DATABASE "{settings.db_base}"'))
