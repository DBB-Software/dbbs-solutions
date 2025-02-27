import logging
from typing import Callable
from unittest.mock import MagicMock

import pytest


def logged_function(logger: logging.Logger) -> None:
    logger.debug('Log debug')
    logger.info("Log info")
    logger.warning("Log warn")
    logger.error("Log error")
    logger.critical("Log critical")


@pytest.mark.parametrize(
    "name, log_level, expected_log_count",
    [
        ("all_log_levels", logging.DEBUG, 5),
        ("info_log_levels", logging.INFO, 4),
        ("warning_log_levels", logging.WARNING, 3),
        ("error_log_levels", logging.ERROR, 2),
        ("critical_log_levels", logging.CRITICAL, 1),
    ],
)
def test_get_logger_with_custom_log_level(
    name: str,
    log_level: int,
    expected_log_count: int,
    caplog: pytest.LogCaptureFixture,
    mock_cloudwatch_handler: MagicMock,
    get_logger: Callable[[str, int], logging.Logger]
) -> None:
    """
    Test `get_logger` with various log levels.
    """
    logger = get_logger(name, log_level)

    with caplog.at_level(log_level):
        logged_function(logger)

        assert len(caplog.records) == expected_log_count
        assert caplog.records[0].name == name
        mock_cloudwatch_handler.assert_called_once()

    caplog.clear()
    mock_cloudwatch_handler.reset_mock()