from fastapi import HTTPException, status


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str) -> None:
        """Returns HTTP 401"""
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail=detail)


class UnauthenticatedException(HTTPException):
    def __init__(self, detail: str) -> None:
        """Returns HTTP 403"""
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)
