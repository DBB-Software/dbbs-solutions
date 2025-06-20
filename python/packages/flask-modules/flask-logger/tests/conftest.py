import os
import pytest
from flask import Flask
from flask_logger.logger import setup_logger
from flask_logger.config import Config

LOG_FILE = Config.LOG_FILE

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config.from_object(Config)
    setup_logger(app)
    yield app

    for handler in list(app.logger.handlers):
        handler.close()
        app.logger.removeHandler(handler)


@pytest.fixture(autouse=True)
def log_cleanup():
    """
    A fixture that yields to a test and then cleans up any generated log files
    after the test is complete.
    """
    
    yield

    rotated_files = [f"{LOG_FILE}.{i}" for i in range(1, Config.LOG_BACKUP_COUNT + 1)]
    files_to_remove = [LOG_FILE] + rotated_files

    for file in files_to_remove:
        if os.path.exists(file):
            os.remove(file)