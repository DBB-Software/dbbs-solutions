from fastapi import HTTPException, status


class UnauthenticatedException(HTTPException):
    def __init__(self, detail: str, **kwargs):
        """Returns HTTP 401"""
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail=detail)
