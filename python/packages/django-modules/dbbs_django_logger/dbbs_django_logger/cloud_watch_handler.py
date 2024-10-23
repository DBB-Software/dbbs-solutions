import logging
import boto3
from django.conf import settings

logger = logging.Logger(__name__)


class CloudWatchHandler(logging.Handler):
    def __init__(self):
        super().__init__()
        self.log_group = getattr(settings, 'LOG_GROUP')
        self.log_stream = getattr(settings, 'LOG_STREAM')
        self.region = getattr(settings, 'AWS_REGION')
        self.access_key_id = getattr(settings, 'AWS_ACCESS_KEY_ID')
        self.secret_access_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY')

        self.client = None
        self.connection_available = False

        try:
            self.client = boto3.client(
                'logs',
                region_name=self.region,
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key
            )
            self._create_log_group()
            self._create_log_stream()
            self.connection_available = True
        except Exception:
            logger.warning("Logger CloudWatchHandler is not initialized")

    def _create_log_group(self):
        try:
            self.client.create_log_group(logGroupName=self.log_group)
        except self.client.exceptions.ResourceAlreadyExistsException:
            logger.info(f"Log group {self.log_group} already exists")

    def _create_log_stream(self):
        try:
            self.client.create_log_stream(logGroupName=self.log_group, logStreamName=self.log_stream)
        except self.client.exceptions.ResourceAlreadyExistsException:
            logger.info(f"Log stream {self.log_stream} already exists")

    def emit(self, record):
        if not self.connection_available:
            return

        log_entry = self.format(record)
        try:
            self.client.put_log_events(
                logGroupName=self.log_group,
                logStreamName=self.log_stream,
                logEvents=[{'message': log_entry, 'timestamp': int(record.created * 1000)}]
            )
        except Exception as e:
            logger.error(f"Failed to send log to CloudWatch: {e}")
            self.connection_available = False
