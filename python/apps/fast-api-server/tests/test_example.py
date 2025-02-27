import uuid

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status


@pytest.mark.anyio
async def test_get_example_success(client: AsyncClient, fastapi_app: FastAPI, patch_verify: None) -> None:
    """
    Checks the health endpoint.

    :param client: client for the app.
    :param fastapi_app: current FastAPI application.
    """
    mock_id = uuid.uuid4()
    url = fastapi_app.url_path_for("get_example", id=mock_id)
    response = await client.get(url)
    response_body = response.json()
    assert response.status_code == status.HTTP_200_OK, "Status code is 200"
    assert response_body["id"] == str(mock_id), "ID is presented in response body"


@pytest.mark.anyio
async def test_get_example_incorrect_id(client: AsyncClient, fastapi_app: FastAPI, patch_verify: None) -> None:
    """
    Checks the health endpoint.

    :param client: client for the app.
    :param fastapi_app: current FastAPI application.
    """
    mock_id = 123
    url = fastapi_app.url_path_for("get_example", id=mock_id)
    response = await client.get(url)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY, "Status code is 422"
