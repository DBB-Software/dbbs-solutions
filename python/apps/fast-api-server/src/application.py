from fastapi import FastAPI
from fastapi.responses import UJSONResponse

from src.api.router import api_router
from src.lifespan import lifespan_setup


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    app = FastAPI(
        title="fast-api-server",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
        lifespan=lifespan_setup,
    )

    # Main router for the API.
    app.include_router(router=api_router, prefix="/api/v1")

    return app
