from typing import Annotated, List

from fast_api_db import get_db_session
from fastapi import Depends
from sqlalchemy import select, asc, desc, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.base import CRUDBaseService
from src.api.meeting_type.schema import MeetingType
from src.db.models.meeting_type import MeetingTypeModel
from src.db.utils import map_filter_db
from src.utils import to_pagination_mapper, Pagination


class MeetingTypeService(CRUDBaseService[MeetingTypeModel, MeetingType]):
    model = MeetingTypeModel

    def __init__(self, db_session: AsyncSession):
        super().__init__(self.model, db_session)

    async def get_all(
        self,
        limit: int,
        offset: int,
        filter_field: str,
        filter_operator: str,
        filter_value: str,
        sort_by: str,
        sort_order: str
    ) -> Pagination[MeetingType]:
        query = select(self._model)

        if all([filter_field, filter_operator, filter_value]):
            if filter_operator in map_filter_db:
                field = getattr(MeetingTypeModel, filter_field, None)
                if field:
                    query = query.where(
                        map_filter_db[filter_operator](
                            field, filter_value
                        )
                    )
                else:
                    raise ValueError(f"Invalid filter field: {filter_field}")

        if sort_by:
            field = getattr(MeetingTypeModel, sort_by, None)
            if field:
                query = query.order_by(
                    asc(field) if sort_order.lower() == "asc" else desc(field)
                )
            else:
                raise ValueError(f"Invalid sort field: {sort_by}")

        total_count = await self._db_session.scalar(
            select(func.count()).select_from(query.subquery())
        )

        query = query.limit(limit).offset(offset)

        results = await self._db_session.execute(query)
        geos = list(results.unique().scalars().fetchall())

        count = len(geos)
        remaining = max(0, total_count - (count + offset))

        result = await self._db_session.execute(query)
        entities: List[MeetingTypeModel] = list(result.scalars().unique())

        return to_pagination_mapper(entities, offset, count, remaining)


async def get_meeting_type_service(db_session: Annotated[AsyncSession, Depends(get_db_session)]) -> MeetingTypeService:
    return MeetingTypeService(db_session)
