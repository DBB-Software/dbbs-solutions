import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, SecurityScopes

from fastapi_authz.exceptions import UnauthenticatedException
from fastapi_authz.settings import settings


class Auth0:
    """Does all the token verification using PyJWT"""

    def __init__(self):
        self.auth0_algorithms = settings.algorithms
        self.auth0_api_audience = settings.api_audience
        self.auth0_issuer = settings.issuer
        jwks_url = f"https://{settings.domain}/.well-known/jwks.json"
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    async def verify(
        self,
        _: SecurityScopes,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    ):
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
                algorithms=self.auth0_algorithms,
                audience=self.auth0_api_audience,
                issuer=self.auth0_issuer,
            )
        except Exception as error:
            raise UnauthenticatedException(str(error))

        return payload
