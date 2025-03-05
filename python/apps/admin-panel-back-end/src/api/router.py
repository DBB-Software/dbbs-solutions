from fastapi import APIRouter

from src.api import geo, meeting_type


api_router = APIRouter()

api_router.include_router(
    geo.router,
    prefix="/geos",
    tags=["geos"]
)
api_router.include_router(
    meeting_type.router,
    prefix="/meeting-types",
    tags=["meeting-types"]
)
