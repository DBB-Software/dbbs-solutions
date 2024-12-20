from copy import deepcopy
from typing import Iterator, Any
from unittest.mock import patch, MagicMock

import pytest
from fastapi.security import SecurityScopes, HTTPAuthorizationCredentials

from fastapi_authz.settings import settings
from fastapi_authz.auth import Auth0
from fastapi_authz.settings import Settings


MOCK_ENV = {
    "domain": "test.auth0.com",
    "api_audience": "https://test-api",
    "issuer": "https://test.auth0.com/",
    "algorithms": "RS256",
}


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    """
    Fixture to set up asyncio session.
    """
    return "asyncio"


@pytest.fixture
def auth0_instance() -> Auth0:
    """
    Fixture to create an instance of Auth0.
    """
    return Auth0()


@pytest.fixture
def mock_security_scopes() -> SecurityScopes:
    """
    Fixture to mock a SecurityScopes.
    """
    return SecurityScopes()


@pytest.fixture
def mock_token() -> HTTPAuthorizationCredentials:
    """
    Fixture to mock a HTTPAuthorizationCredentials.
    """
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials="token")


@pytest.fixture
def mock_jwks_client() -> Iterator[Any]:
    """
    Fixture to create a mock instance of PyJWKClient.
    """
    with patch("jwt.PyJWKClient") as mock_client:
        mock_key = MagicMock()
        mock_key.key = "mock_signing_key"
        mock_client_instance = mock_client.return_value
        mock_client_instance.get_signing_key_from_jwt.return_value = mock_key
        yield mock_client_instance


@pytest.fixture
def patch_settings(request) -> Iterator[Settings]:
    """
    Fixture to set up settings with optional overridden MOCK_ENV.
    """
    original_settings = settings.model_copy()
    mock_env = deepcopy(MOCK_ENV)

    if hasattr(request, "param"):
        mock_env.update(request.param)

    for k, v in settings.model_fields.items():
        setattr(settings, k, v.default)

    for key, val in mock_env.items():
        if not hasattr(settings, key):
            raise ValueError(f"Unknown setting: {key}")

        setattr(settings, key, val)

    yield settings

    settings.__dict__.update(original_settings.__dict__)
