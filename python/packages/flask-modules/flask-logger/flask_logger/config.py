import logging


class Config:
    """
    Logging configuration for application.
    """
    LOG_LEVEL = logging.INFO # Logging level
    LOG_FILE = "app.log" # Log file name
    LOG_MAX_BYTES = 10_000_000  # 10 MB. Maximum log file size
    LOG_BACKUP_COUNT = 3 # Number of backup log files to retain
