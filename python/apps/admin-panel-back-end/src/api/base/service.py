from typing import Type, TypeVar, Generic, List

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel


T = TypeVar("T")  # SQLAlchemy model type
S = TypeVar("S", bound=BaseModel)  # Pydantic schema type


class CRUDBaseService(Generic[T, S]):
    def __init__(self, model: Type[T], db_session: AsyncSession):
        self._model = model
        self._db_session = db_session

    async def get(self, id: int) -> T:
        result = await self._db_session.execute(select(self._model).filter(self._model.id == id))
        obj = result.scalars().first()
        if not obj:
            raise HTTPException(status_code=404, detail="Item not found")
        return obj

    async def get_all(
            self,
            limit: int,
            offset: int,
            filter_field: str,
            filter_operator: str,
            filter_value: str,
            sort_by: str,
            sort_order: str
    ) -> List[T]:
        result = await self._db_session.execute(select(self._model))
        return result.scalars().all()

    async def create(self, obj_data: S) -> T:
        obj_dict = obj_data.dict(exclude_unset=True)
        obj = self._model(**obj_dict)
        self._db_session.add(obj)
        await self._db_session.commit()
        await self._db_session.refresh(obj)
        return obj

    async def update(self, id: int, obj_data: S) -> T:
        obj = await self.get(id)
        for key, value in obj_data.dict(exclude_unset=True).items():
            setattr(obj, key, value)
        await self._db_session.commit()
        await self._db_session.refresh(obj)
        return obj

    async def delete(self, id: int) -> None:
        obj = await self.get(id)
        await self._db_session.delete(obj)
        await self._db_session.commit()
