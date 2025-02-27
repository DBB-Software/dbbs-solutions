import logging
from typing import Optional
from fast_api_cloudwatch.settings import settings
from fast_api_cloudwatch.formatters import JSONFormatter
from fast_api_cloudwatch.cloudwatch import get_cloudwatch_handler


def get_logger(
    log_name: Optional[str] = None,
    logging_level: Optional[int] = None
) -> logging.Logger:
    log_name = log_name or settings.log_name
    logging_level = logging_level or settings.log_level

    logger = logging.getLogger(log_name)
    logger.setLevel(logging_level)

    if logger.handlers:
        return logger

    if not all([
        settings.aws_access_key_id,
        settings.aws_secret_access_key,
        settings.aws_session_token
    ]):
        logger.warning("AWS credentials are not provided!")
        return logger

    add_stream_handler(logger)
    add_cloudwatch_handler(logger)

    return logger


def add_stream_handler(logger: logging.Logger) -> None:
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(JSONFormatter())
    logger.addHandler(stream_handler)


def add_cloudwatch_handler(logger: logging.Logger) -> None:
    cloudwatch_handler = get_cloudwatch_handler()
    cloudwatch_handler.setFormatter(JSONFormatter())
    logger.addHandler(cloudwatch_handler)
