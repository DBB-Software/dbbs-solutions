import os
import json
import time
import uuid
import socket
from logging import Formatter, LogRecord


class JSONFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        log_record = {
            "level": record.levelno,
            "time": int(time.time() * 1000),
            "pid": os.getpid(),
            "hostname": socket.gethostname(),
            "req": f"{getattr(record, 'method', 'Redacted')}",
            "awsRequestId": str(uuid.uuid4()),
            "apiRequestId": str(uuid.uuid4()),
            "x-correlation-id": str(uuid.uuid4()),
            "context": record.pathname,
            "msg": record.getMessage(),
        }
        return json.dumps(log_record)
