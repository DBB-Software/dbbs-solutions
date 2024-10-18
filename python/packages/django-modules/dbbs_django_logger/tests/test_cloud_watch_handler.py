import pytest
from unittest.mock import MagicMock, patch
from dbbs_django_logger.cloud_watch_handler import CloudWatchHandler


@pytest.fixture(scope='module', autouse=True)
def django_settings():
    from django.conf import settings
    settings.configure(
        LOG_GROUP='test-log-group',
        LOG_STREAM='test-log-stream',
        AWS_REGION='us-east-1',
        AWS_ACCESS_KEY_ID='fake-access-key',
        AWS_SECRET_ACCESS_KEY='fake-secret-key'
    )


@pytest.fixture
def mock_boto_client(mocker):
    return mocker.patch('boto3.client')


@patch('dbbs_django_logger.cloud_watch_handler.logger')
def test_cloudwatch_handler_initialization_success(mock_logger, mock_boto_client):
    mock_client = MagicMock()
    mock_boto_client.return_value = mock_client

    handler = CloudWatchHandler()

    mock_boto_client.assert_called_once_with(
        'logs',
        region_name='us-east-1',
        aws_access_key_id='fake-access-key',
        aws_secret_access_key='fake-secret-key'
    )

    mock_client.create_log_group.assert_called_once_with(logGroupName='test-log-group')
    mock_client.create_log_stream.assert_called_once_with(logGroupName='test-log-group',
                                                          logStreamName='test-log-stream')

    assert handler.connection_available

    mock_logger.warning.assert_not_called()


@patch('dbbs_django_logger.cloud_watch_handler.logger')
def test_cloudwatch_handler_initialization_failure(mock_logger, mock_boto_client):
    mock_boto_client.side_effect = Exception("Connection error")

    handler = CloudWatchHandler()

    mock_boto_client.assert_called_once_with(
        'logs',
        region_name='us-east-1',
        aws_access_key_id='fake-access-key',
        aws_secret_access_key='fake-secret-key'
    )

    mock_logger.warning.assert_called_once_with("Logger CloudWatchHandler is not initialized")

    assert not handler.connection_available
