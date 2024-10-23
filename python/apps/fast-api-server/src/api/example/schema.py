from uuid import UUID

from pydantic import BaseModel


class Example(BaseModel):
    """Simple example model."""

    id: UUID
    date: str
