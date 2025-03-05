
from fastapi import APIRouter, Depends, Query

from src.api.geo.schema import Geo, GeoCreate
from src.api.geo.service import GeoService, get_geo_service
from src.utils import Pagination

router = APIRouter()


@router.get("", response_model=Pagination[Geo])
async def get_all_geos(
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
    service: GeoService = Depends(get_geo_service)
):
    return await service.get_all(limit, offset, filter_field, filter_operator, filter_value, sort_by, sort_order)


@router.get("/{id}", response_model=Geo)
async def get_geo_by_id(
    id: int,
    service: GeoService = Depends(get_geo_service)
):
    return await service.get(id)


@router.post("", response_model=Geo)
async def create_new_geo(
    obj: GeoCreate,
    service: GeoService = Depends(get_geo_service)
):
    return await service.create(obj)


@router.patch("/{id}", response_model=Geo)
async def update_geo(
    id: int,
    obj: Geo,
    service: GeoService = Depends(get_geo_service)
) -> Geo:
    return await service.update(id, obj)


@router.delete("/{id}")
async def delete_geo(
    id: int,
    service: GeoService = Depends(get_geo_service)
):
    return await service.delete(id)
