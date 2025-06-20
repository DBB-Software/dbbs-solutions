from fastapi import APIRouter, Depends, Query

from src.api.type.schema import Type, TypeCreate
from src.api.type.service import TypeService, get_type_service
from src.utils import Pagination

router = APIRouter()


@router.get("", response_model=Pagination[Type])
async def get_all_types(
    limit: int = Query(10, ge=1, description="The number of results to return"),
    offset: int = Query(0, ge=0, description="The starting point for the results"),
    filter_field: str = Query(
        "", description="Field for filtering", alias="filterField", examples=["name"]
    ),
    filter_operator: str = Query(
        "",
        description="Filter operator",
        alias="filterOperator",
        examples=["afaf"],
    ),
    filter_value: str = Query(
        "", description="Filter value", alias="filterValue", examples=["name"]
    ),
    sort_by: str = Query(
        "id", description="Sort by", alias="sortBy", examples=["name"]
    ),
    sort_order: str = Query(
        "asc", description="Sort order", alias="sortOrder", examples=["desc"]
    ),
    service: TypeService = Depends(get_type_service)
):
    return await service.get_all(limit, offset, filter_field, filter_operator, filter_value, sort_by, sort_order)


@router.get("/{id}", response_model=Type)
async def get_type_by_id(
    id: int,
    service: TypeService = Depends(get_type_service)
):
    return await service.get(id)


@router.post("", response_model=Type)
async def create_new_type(
    obj: TypeCreate,
    service: TypeService = Depends(get_type_service)
):
    return await service.create(obj)


@router.patch("/{id}", response_model=Type)
async def update_type(
    id: int,
    obj: Type,
    service: TypeService = Depends(get_type_service)
):
    return await service.update(id, obj)


@router.delete("/{id}")
async def delete_product(
    id: int,
    service: TypeService = Depends(get_type_service)
):
    return await service.delete(id)
