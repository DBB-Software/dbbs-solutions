from fastapi import Security, APIRouter
from fastapi_authz import Auth0

from src.api import example

api_router = APIRouter()
auth = Auth0()
api_router.include_router(
    example.router,
    prefix="/examples",
    tags=["example"],
    dependencies=[Security(auth.verify)],
)
