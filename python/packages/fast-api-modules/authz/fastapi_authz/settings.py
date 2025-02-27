from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    domain: str = ""
    api_audience: str | List[str] = ""
    issuer: str = ""

    model_config = SettingsConfigDict(
        env_file=".env", env_prefix="AUTH0_", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
