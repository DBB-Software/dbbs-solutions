from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    """
    Configuration for development environment.
    """

    host: str = "127.0.0.1"
    port: int = 5000
    debug: bool = True
    use_reloader: bool = True
    use_debugger: bool = True

    model_config = SettingsConfigDict(
        env_file=".env", env_prefix="APP_", env_file_encoding="utf-8", extra="ignore"
    )


config = Config()


class TestConfig:
    """
    Configuration for testing environment.
    """

    TESTING: bool = True
