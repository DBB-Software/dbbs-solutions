from src.app import create_app
from src.config import config


def main():
    app = create_app()
    app.run(
        host=config.host,
        port=config.port,
        debug=config.debug,
        use_reloader=config.use_reloader,
        use_debugger=config.use_reloader,
    )


if __name__ == "__main__":
    main()
