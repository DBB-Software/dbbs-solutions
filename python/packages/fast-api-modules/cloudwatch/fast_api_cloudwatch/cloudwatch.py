import watchtower
import boto3

from fast_api_cloudwatch.settings import settings
from fast_api_cloudwatch.utils import create_log_stream_name


aws_region = settings.aws_region
log_group = settings.log_group
log_name = settings.log_name
aws_access_key_id = settings.aws_access_key_id
aws_secret_access_key = settings.aws_secret_access_key
aws_session_token = settings.aws_session_token

stream_name = create_log_stream_name(log_name)


def get_cloudwatch_handler() -> watchtower.CloudWatchLogHandler:
    return watchtower.CloudWatchLogHandler(
        log_group_name=log_group,
        boto3_client=boto3.client(
            "logs",
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            aws_session_token=aws_session_token,
            region_name=aws_region
        ),
        log_stream_name=stream_name
    )
