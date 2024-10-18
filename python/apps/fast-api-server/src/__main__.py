import uvicorn

from src.gunicorn_runner import GunicornApplication
from src.settings import settings


def main() -> None:
    """Entrypoint of the application."""
    if settings.debug:
        uvicorn.run(
            "src.application:get_app",
            workers=settings.workers_count,
            host=settings.host,
            port=settings.port,
            reload=settings.debug,
            log_level=settings.log_level.value.lower(),
            factory=True,
        )
    else:
        # We choose gunicorn only if reload
        # option is not used, because reload
        # feature doesn't work with gunicorn workers.
        GunicornApplication(
            "src.application:get_app",
            host=settings.host,
            port=settings.port,
            workers=settings.workers_count,
            factory=True,
            accesslog="-",
            loglevel=settings.log_level.value.lower(),
            access_log_format='%r "-" %s "-" %Tf',
        ).run()


if __name__ == "__main__":
    main()
