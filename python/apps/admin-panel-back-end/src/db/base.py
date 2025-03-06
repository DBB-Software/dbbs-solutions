from datetime import datetime

from sqlalchemy import String
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from src.db.meta import meta


class Base(AsyncAttrs, DeclarativeBase):
    """Base for all models."""

    metadata = meta
    created_at: Mapped[str] = mapped_column(
        String(200), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[str] = mapped_column(
        String(200), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True
    )
