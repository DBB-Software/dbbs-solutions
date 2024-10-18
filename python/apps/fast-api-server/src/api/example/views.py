from uuid import UUID

from fastapi import APIRouter, Depends

from src.api.example.schema import Example
from src.api.example.service import ExampleService, get_example_service

router = APIRouter()


@router.get("/{id}", response_model=Example)
async def get_example(id: UUID, example_service: ExampleService = Depends(get_example_service)) -> Example:
    """
    Sends example by id to user.

    :param id: incoming id.
    :returns: example by incoming id.
    """
    return example_service.get_example(id)
