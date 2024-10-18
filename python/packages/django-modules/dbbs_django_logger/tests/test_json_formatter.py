import logging
import json
import uuid
from unittest.mock import patch
from dbbs_django_logger.json_formatter import JSONFormatter


@patch("uuid.uuid4")
@patch("time.time")
@patch("os.getpid")
@patch("socket.gethostname")
def test_json_formatter_format_method(mock_hostname, mock_pid, mock_time, mock_uuid):
    mock_hostname.return_value = "test_host"
    mock_pid.return_value = 1234
    mock_time.return_value = 1694090192.123456
    mock_uuid.side_effect = [
        uuid.UUID("12345678-1234-5678-1234-567812345678"),
        uuid.UUID("87654321-4321-8765-4321-876543218765"),
        uuid.UUID("56781234-8765-4321-8765-432156781234")
    ]

    formatter = JSONFormatter()

    log_record = logging.LogRecord(
        name="test_logger",
        level=logging.INFO,
        pathname=__file__,
        lineno=10,
        msg="Test log message",
        args=(),
        exc_info=None
    )

    log_record.method = "GET"

    formatted_log = formatter.format(log_record)

    assert isinstance(formatted_log, str), "Format of result must be a string"

    log_data = json.loads(formatted_log)

    assert log_data["level"] == logging.INFO
    assert log_data["time"] == 1694090192123
    assert log_data["pid"] == 1234
    assert log_data["hostname"] == "test_host"
    assert log_data["req"] == "GET"
    assert log_data["awsRequestId"] == "12345678-1234-5678-1234-567812345678"
    assert log_data["apiRequestId"] == "87654321-4321-8765-4321-876543218765"
    assert log_data["x-correlation-id"] == "56781234-8765-4321-8765-432156781234"
    assert log_data["msg"] == "Test log message"
