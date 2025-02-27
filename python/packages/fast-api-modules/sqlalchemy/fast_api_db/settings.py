from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    connection_uri: str = ""
    echo: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="DB_",
        extra="ignore",
        env_file_encoding="utf-8",
    )

    @field_validator("connection_uri", mode="before")
    def validate_connection_uri(cls, value: str) -> str:
        # Ensure PostgreSQL uses asyncpg
        if value.startswith("postgresql://") and not value.startswith("postgresql+asyncpg://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)

        # Ensure SQLite uses aiosqlite for async support
        if value.startswith("sqlite://") and not value.startswith("sqlite+aiosqlite://"):
            return value.replace("sqlite://", "sqlite+aiosqlite://", 1)

        return value


settings = Settings()
