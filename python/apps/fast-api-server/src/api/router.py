from fastapi.routing import APIRouter

from src.api import example

api_router = APIRouter()
api_router.include_router(example.router, prefix="/examples", tags=["example"])
