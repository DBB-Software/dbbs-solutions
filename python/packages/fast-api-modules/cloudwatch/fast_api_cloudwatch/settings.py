import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    log_name: str = "fast-api-logs"
    log_group: str = "fast-api-log-development"
    log_level: int = logging.DEBUG

    aws_region: Optional[str] = None
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_session_token: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="LOGS_",
        extra='ignore',
        env_file_encoding="utf-8",
    )


settings = Settings()
