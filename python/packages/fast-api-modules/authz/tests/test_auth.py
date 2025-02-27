from typing import Dict, Any

import jwt
import pytest
from unittest.mock import patch, MagicMock

from jwt import PyJWTError
from jwt.api_jwt import PyJWT

from fastapi.security import SecurityScopes, HTTPAuthorizationCredentials

from fastapi_authz import Auth0
from fastapi_authz.settings import Settings, settings
from fastapi_authz.exceptions import UnauthorizedException, UnauthenticatedException


options = {
    "verify_signature": True,
    "verify_exp": False,
    "verify_nbf": False,
    "verify_iat": False,
    "verify_aud": True,
    "verify_iss": False,
    "require": [],
}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "mock_jwt_decode_return,expected_payload",
    [
        ({"sub": "user_id"}, {"sub": "user_id"}),
    ],
)
@patch("jwt.decode")
async def test_verify_token_success_with_empty_scopes(
    mock_jwt_decode: MagicMock,
    mock_jwt_decode_return: Dict[str, Any],
    expected_payload: Dict[str, Any],
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    """
    Test verify_token success cases with empty security scopes.
    """
    mock_jwt_decode.return_value = mock_jwt_decode_return

    payload = await auth0_instance.verify(SecurityScopes(), mock_token)
    assert payload == expected_payload
    assert mock_jwt_decode.called


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "mock_jwt_decode_return,security_scopes,expected_payload",
    [
        (
            {"sub": "user_id", "permissions": ["test:correct_permission"]},
            SecurityScopes(["test:correct_permission"]),
            {"sub": "user_id", "permissions": ["test:correct_permission"]},
        ),
        (
            {
                "sub": "user_id",
                "permissions": [
                    "test:correct_permission",
                    "test:second_correct_permission",
                ],
            },
            SecurityScopes(["test:correct_permission"]),
            {
                "sub": "user_id",
                "permissions": [
                    "test:correct_permission",
                    "test:second_correct_permission",
                ],
            },
        ),
    ],
)
@patch("jwt.decode")
async def test_verify_token_success_with_scopes(
    mock_jwt_decode: MagicMock,
    mock_jwt_decode_return: Dict[str, Any],
    security_scopes: SecurityScopes,
    expected_payload: Dict[str, Any],
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    """
    Test verify_token success cases with non-empty security scopes.
    """
    mock_jwt_decode.return_value = mock_jwt_decode_return

    payload = await auth0_instance.verify(security_scopes, mock_token)
    assert payload == expected_payload
    assert mock_jwt_decode.called


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "mock_jwt_decode_side_effect,expected_error_message",
    [
        (
            jwt.exceptions.ExpiredSignatureError("Signature has expired"),
            "Signature has expired",
        ),
        (
            jwt.exceptions.InvalidTokenError("Invalid token"),
            "Invalid token",
        ),
        (
            jwt.exceptions.InvalidSignatureError("Invalid signature"),
            "Invalid signature",
        ),
        (
            jwt.exceptions.InvalidAudienceError("Invalid audience"),
            "Invalid audience",
        ),
        (
            jwt.exceptions.InvalidIssuerError("Invalid issuer"),
            "Invalid issuer",
        ),
        (
            jwt.exceptions.InvalidAlgorithmError("Invalid algorithm"),
            "Invalid algorithm",
        ),
        (
            jwt.exceptions.MissingRequiredClaimError("aud"),
            'Token is missing the "aud" claim',
        ),
        (
            jwt.exceptions.InvalidAudienceError("Audience doesn't match"),
            "Audience doesn't match",
        ),
    ],
)
@patch("jwt.decode")
async def test_verify_token_failure_with_empty_scopes(
    mock_jwt_decode: MagicMock,
    mock_jwt_decode_side_effect: PyJWTError,
    expected_error_message: str,
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    """
    Test verify_token failure cases with empty security scopes.
    """
    mock_jwt_decode.side_effect = (
        mock_jwt_decode_side_effect
        if isinstance(mock_jwt_decode_side_effect, Exception)
        else lambda *args, **kwargs: mock_jwt_decode_side_effect
    )

    with pytest.raises(UnauthenticatedException) as excinfo:
        await auth0_instance.verify(SecurityScopes(), mock_token)

    assert excinfo.value.status_code == 403
    assert excinfo.value.detail == expected_error_message
    assert mock_jwt_decode.called


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "mock_jwt_decode_side_effect,security_scopes,expected_error_message",
    [
        (
            {"sub": "user_id", "permissions": ["test:incorrect_permission"]},
            SecurityScopes(["test:correct_permission"]),
            "Permission denied",
        ),
        (
            {"sub": "user_id", "permissions": ["test:correct_permission"]},
            SecurityScopes(
                ["test:correct_permission", "test:second_correct_permission"]
            ),
            "Permission denied",
        ),
    ],
)
@patch("jwt.decode")
async def test_verify_token_failure_with_scopes(
    mock_jwt_decode: MagicMock,
    mock_jwt_decode_side_effect: Dict[str, Any],
    security_scopes: SecurityScopes,
    expected_error_message: str,
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    """
    Test verify_token failure cases with non-empty security scopes.
    """
    mock_jwt_decode.side_effect = (
        mock_jwt_decode_side_effect
        if isinstance(mock_jwt_decode_side_effect, Exception)
        else lambda *args, **kwargs: mock_jwt_decode_side_effect
    )

    with pytest.raises(UnauthorizedException) as excinfo:
        await auth0_instance.verify(security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == expected_error_message
    assert mock_jwt_decode.called


@pytest.mark.asyncio
async def test_verify_token_which_contains_one_aud_and_server_contains_same_aud(
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    token = {"sub": "user_id", "aud": "https://test-api"}

    py_jwt = PyJWT()
    py_jwt._validate_claims(
        token, options, audience=settings.api_audience, issuer=settings.issuer
    )


@pytest.mark.asyncio
async def test_verify_token_which_contains_one_aud_and_server_contains_another_aud(
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    try:
        token = {"sub": "user_id", "aud": "https://test-api-new"}

        py_jwt = PyJWT()
        py_jwt._validate_claims(
            token, options, audience=settings.api_audience, issuer=settings.issuer
        )
    except Exception as excinfo:
        assert excinfo.args[0] == "Audience doesn't match"


@pytest.mark.parametrize(
    "patch_settings",
    [{"api_audience": ["https://test-api", "https://test-api-new"]}],
    indirect=True,
)
@pytest.mark.asyncio
async def test_verify_token_which_contains_one_aud_and_server_contains_same_and_another_aud(
    mock_jwks_client: Any,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_token: HTTPAuthorizationCredentials,
) -> None:
    token = {"sub": "user_id", "aud": "https://test-api"}

    py_jwt = PyJWT()
    py_jwt._validate_claims(
        token, options, audience=settings.api_audience, issuer=settings.issuer
    )
