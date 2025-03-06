from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class Pagination(BaseModel, Generic[T]):
    cursor: int = Field(..., ge=0)
    count: int = Field(..., ge=0)
    remaining: int = Field(..., ge=0)
    results: List[T]


def to_pagination_mapper(models: List[T], cursor, count, remaining) -> Pagination[T]:
    return Pagination[T](
        cursor=cursor,
        count=count,
        remaining=remaining,
        results=models,
    )
