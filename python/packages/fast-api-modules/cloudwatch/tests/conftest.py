import os
import logging
from typing import Callable, Any

import pytest

test_environment = {
    'LOGS_AWS_ACCESS_KEY_ID': 'test_access_key',
    'LOGS_AWS_SECRET_ACCESS_KEY': 'test_secret_key',
    'LOGS_AWS_REGION': 'test_region',
    'LOGS_AWS_SESSION_TOKEN': 'test_session',
}


@pytest.fixture(scope='function')
def set_environment() -> None:
    for key, value in test_environment.items():
        os.environ[key] = value


@pytest.fixture(scope='function')
def mock_cloudwatch_handler(mocker: Any, set_environment: None) -> Any:
    mock = mocker.patch('fast_api_cloudwatch.app_logger.get_cloudwatch_handler')
    mock.return_value = logging.StreamHandler()
    return mock


@pytest.fixture(scope='function')
def get_logger(set_environment: None) -> Callable[[str, int], logging.Logger]:
    from fast_api_cloudwatch.app_logger import get_logger
    return get_logger
