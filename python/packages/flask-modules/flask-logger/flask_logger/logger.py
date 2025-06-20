import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_logger.config import Config


def setup_logger(app: Flask):
    """
    Set up logging for Flask application.

    :param app: Flask application.
    """
    log_level = Config.LOG_LEVEL
    log_file = Config.LOG_FILE
    max_bytes = Config.LOG_MAX_BYTES
    backup_count = Config.LOG_BACKUP_COUNT

    # Create file handler
    file_handler = RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=backup_count)
    file_handler.setLevel(log_level)

    # Define the logging format
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)

    # Add handler to the app
    app.logger.addHandler(file_handler)
    app.logger.setLevel(log_level)
