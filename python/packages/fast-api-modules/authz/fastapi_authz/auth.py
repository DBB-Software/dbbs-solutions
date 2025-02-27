from typing import Any, List

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, SecurityScopes

from fastapi_authz.exceptions import UnauthenticatedException, UnauthorizedException
from fastapi_authz.settings import settings


class Auth0:
    """Does all the token verification using PyJWT"""

    def __init__(self) -> None:
        self.auth0_api_audience = settings.api_audience
        self.auth0_issuer = settings.issuer
        jwks_url = f"https://{settings.domain}/.well-known/jwks.json"
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    # TODO replace Any type to strategy token type
    async def verify(
        self,
        security_scopes: SecurityScopes,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    ) -> Any:
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(
                token.credentials
            ).key
        except jwt.exceptions.PyJWKClientError as error:
            raise UnauthenticatedException(str(error))
        except jwt.exceptions.DecodeError as error:
            raise UnauthenticatedException(str(error))

        try:
            payload = jwt.decode(
                token.credentials,
                signing_key,
                audience=self.auth0_api_audience,
                issuer=self.auth0_issuer,
            )
        except Exception as error:
            raise UnauthenticatedException(str(error))

        if len(security_scopes.scopes) > 0:
            self._check_claims(payload, "permissions", security_scopes.scopes)

        return payload

    @staticmethod
    def _check_claims(payload: Any, claim_name: str, expected_value: List[str]) -> None:
        if claim_name not in payload:
            raise UnauthorizedException(
                detail=f'No claim "{claim_name}" found in token'
            )

        payload_claim = payload[claim_name]

        for value in expected_value:
            if value not in payload_claim:
                raise UnauthorizedException(detail="Permission denied")
