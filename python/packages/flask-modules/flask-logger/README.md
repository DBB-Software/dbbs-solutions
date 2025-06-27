## Name: flask-logger

## Description

The flask-logger module provides logging capabilities for Flask application. It uses Python's build-in logging module
and supports features like rotating of log files.

## Usage

Install `"flask-logger` into your application using poetry.

```bash
poetry add ../../packages/flask-modules/flask-logger
```

## Examples

To use flask-logger in Flask app, import it from the package and initialize in Flask application setup.

```python
# app.py
from flask import Flask
from src.api.example.routes import example_blueprint
from src.config import Config

from flask_logger.logger import setup_logger


def create_app(config_class=Config):
    app = Flask(__name__)

    # Load configuration into the app
    app.config.from_object(config_class)

    app.register_blueprint(example_blueprint)

    # Set up logging
    setup_logger(app)

    return app
```

## Configuration

Customize logging behaviour by modifying the Config class.

```python
class Config:
    """
    Logging configuration for application.
    """
    LOG_LEVEL = logging.INFO  # Logging level
    LOG_FILE = "app.log"  # Log file name
    LOG_MAX_BYTES = 10_000_000  # 10 MB. Maximum log file size
    LOG_BACKUP_COUNT = 3  # Number of backup log files to retain
```

## Features

- Configurable logging level, file size, and numbers of backup.
- Centralized logging for all Flask routes.
- File rotation using RotatingFileHandler.
- Log format includes timestamp, logger name, log level, and message.

## Feature Keywords

- flask-logger
- flask
- logging

## Language and framework

- Python
- Flask

## Type

- Module

## Tech Category

- Back-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- antonskazko

## Links

- [Flask documentation](https://flask.palletsprojects.com/en/stable/)
- [Flask logging](https://flask.palletsprojects.com/en/stable/logging/)
- [Python logging documentation](https://docs.python.org/3/library/logging.html)

## Relations

- python/apps/flask-server

## External dependencies

- flask
