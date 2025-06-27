from fastapi import APIRouter

from src.api import product, type


api_router = APIRouter()

api_router.include_router(
    product.router,
    prefix="/products",
    tags=["products"]
)
api_router.include_router(
    type.router,
    prefix="/types",
    tags=["types"]
)
