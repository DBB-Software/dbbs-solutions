import os
import logging
from logging.handlers import RotatingFileHandler
from flask_logger.config import Config

LOG_FILE = Config.LOG_FILE


def test_log_file_creation(app):
    """
    Test that log file is created after logging.
    """
    test_message = "Test log message."
    app.logger.info(test_message)

    assert os.path.exists(LOG_FILE)


def test_logger_level(app):
    """
    Test that the logger level is set correctly.
    """
    log_level = Config.LOG_LEVEL
    assert app.logger.level == log_level, f"Logger level should be {log_level}."


def test_logger_format(app):
    """
    Test that the logger handler has correct format.
    """
    formatter = next(
        (handler.formatter for handler in app.logger.handlers if isinstance(handler, RotatingFileHandler)),
        None
    )
    
    assert formatter is not None, "Could not find the expected RotatingFileHandler."

    expected_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

    assert formatter._fmt == expected_format, f"Format should be {expected_format}."


def test_logging_levels(app):
    """
    Test that messages are logged.
    """
    app.logger.setLevel(logging.DEBUG)

    test_info_message = "Test INFO log message."
    test_error_message = "Test ERROR log message."

    app.logger.info(test_info_message)
    app.logger.error(test_error_message)

    with open(LOG_FILE, 'r') as f:
        all_logs = f.read()

    assert "INFO" in all_logs
    assert "Test INFO log message" in all_logs
    assert "ERROR" in all_logs
    assert "Test ERROR log message" in all_logs


def test_log_rotation(app):
    """
    Test that log rotation occurs when the log file exceeds the specified size.
    """

    max_bytes = Config.LOG_MAX_BYTES

    test_message = "Test log message" * 100  # Each log message is 100 bytes.
    # Calculate the number of messages required to exceed the maximum log file size.
    num_messages = max_bytes // len(test_message) + 1

    # Write log messages
    for _ in range(num_messages):
        app.logger.info(test_message)

    # Check for rotated log files
    rotated_files = [f"{LOG_FILE}.{i}" for i in range(1, Config.LOG_BACKUP_COUNT + 1)]
    rotated_files_exist = any(os.path.exists(f) for f in rotated_files)

    # Check that the log file and rotated files exists
    assert os.path.exists(LOG_FILE), "Log file should exist after logging."
    assert rotated_files_exist, "Log rotation exist."
