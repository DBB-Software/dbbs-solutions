import jwt
import pytest
from unittest.mock import patch
from jwt.api_jwt import PyJWT

from fastapi.security import SecurityScopes, HTTPAuthorizationCredentials

from fastapi_authz import Auth0
from fastapi import HTTPException

from fastapi_authz.settings import Settings, settings


options = {
    "verify_signature": True,
    "verify_exp": False,
    "verify_nbf": False,
    "verify_iat": False,
    "verify_aud": True,
    "verify_iss": False,
    "require": [],
}


def assert_decode_call(decode) -> None:
    decode.assert_called_once_with(
        "token",
        "mock_signing_key",
        algorithms="RS256",
        audience="https://test-api",
        issuer="https://test.auth0.com/",
    )


@patch("jwt.decode", return_value={"sub": "user_id"})
@pytest.mark.asyncio
async def test_verify_token_success(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token succeeds with valid token.
    """

    payload = await auth0_instance.verify(mock_security_scopes, mock_token)

    assert payload == {"sub": "user_id"}

    assert_decode_call(mock_decode)


@patch(
    "jwt.decode",
    side_effect=jwt.exceptions.ExpiredSignatureError("Signature has expired"),
)
@pytest.mark.asyncio
async def test_verify_token_expired(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for expired token.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Signature has expired"

    assert_decode_call(mock_decode)


@patch("jwt.decode", side_effect=jwt.exceptions.InvalidTokenError("Invalid token"))
@pytest.mark.asyncio
async def test_verify_token_invalid(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for invalid token.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Invalid token"

    assert_decode_call(mock_decode)


@patch(
    "jwt.decode", side_effect=jwt.exceptions.InvalidSignatureError("Invalid signature")
)
@pytest.mark.asyncio
async def test_verify_token_invalid_signature(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for invalid signature.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Invalid signature"

    assert_decode_call(mock_decode)


@patch(
    "jwt.decode", side_effect=jwt.exceptions.InvalidAudienceError("Invalid audience")
)
@pytest.mark.asyncio
async def test_verify_token_invalid_audience(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for invalid audience.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Invalid audience"

    assert_decode_call(mock_decode)


@patch("jwt.decode", side_effect=jwt.exceptions.InvalidIssuerError("Invalid issuer"))
@pytest.mark.asyncio
async def test_verify_token_invalid_issuer(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for invalid issuer.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Invalid issuer"

    assert_decode_call(mock_decode)


@patch(
    "jwt.decode", side_effect=jwt.exceptions.InvalidAlgorithmError("Invalid algorithm")
)
@pytest.mark.asyncio
async def test_verify_token_invalid_algorithm(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for invalid algorithm.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Invalid algorithm"

    assert_decode_call(mock_decode)


@patch("jwt.decode", side_effect=jwt.exceptions.MissingRequiredClaimError("aud"))
@pytest.mark.asyncio
async def test_verify_token_does_not_contain_audience(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for missed aud claims.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == 'Token is missing the "aud" claim'

    assert_decode_call(mock_decode)


@patch(
    "jwt.decode",
    side_effect=jwt.exceptions.InvalidAudienceError("Audience doesn't match"),
)
@pytest.mark.asyncio
async def test_verify_token_does_not_match_audience(
    mock_decode,
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    """
    Test verify_token raises HTTPException for miss matched audience.
    """

    with pytest.raises(HTTPException) as excinfo:
        await auth0_instance.verify(mock_security_scopes, mock_token)

    assert excinfo.value.status_code == 401
    assert excinfo.value.detail == "Audience doesn't match"

    assert_decode_call(mock_decode)


@pytest.mark.asyncio
async def test_verify_token_which_contains_one_aud_and_server_contains_same_aud(
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    token = {"sub": "user_id", "aud": "https://test-api"}

    py_jwt = PyJWT()
    py_jwt._validate_claims(
        token, options, audience=settings.api_audience, issuer=settings.issuer
    )


@pytest.mark.asyncio
async def test_verify_token_which_contains_one_aud_and_server_contains_another_aud(
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
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
    mock_jwks_client,
    patch_settings: Settings,
    auth0_instance: Auth0,
    mock_security_scopes: SecurityScopes,
    mock_token: HTTPAuthorizationCredentials,
):
    token = {"sub": "user_id", "aud": "https://test-api"}

    py_jwt = PyJWT()
    py_jwt._validate_claims(
        token, options, audience=settings.api_audience, issuer=settings.issuer
    )
