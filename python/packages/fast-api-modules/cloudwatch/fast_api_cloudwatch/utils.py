import re
from datetime import datetime


def create_log_stream_name(log_name: str) -> str:
    # Sanitize the logger name: remove invalid characters
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', log_name)

    # Get the current date in the desired format
    timestamp = datetime.now().strftime('%y-%m-%d')

    # Create the log stream name
    log_stream_name = f"{sanitized_name}-{timestamp}"
    return log_stream_name
