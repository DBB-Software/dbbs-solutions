## fast-api-cloudwatch

### Description

The Cloudwatch Logger for FastAPI offers a powerful logging solution tailored for your application's needs. Built upon the watchtower logger adapter, this module introduces custom features to enhance your logging experience.

### Installation

Install `fast-api-cloudwatch` into your application using poetry.

```bash
poetry add ../../packages/fast-api-modules/cloudwatch
```

### Language and framework

- Python
- FastAPI

### Type
- Module

### Required environment variables
```bash
LOGS_AWS_ACCESS_KEY_ID: str
LOGS_AWS_SECRET_ACCESS_KEY: str
LOGS_AWS_SESSION_TOKEN: str
```

### Usage

- Default usage
```python
from fast_api_cloudwatch import get_logger

logger = get_logger()

class ExampleService:
    def get_example(self, example_id: int):
        try:
            return Example(...)
        except Exception as e:
            logger.error(f"Error get example record: {e}")
            raise CustomException(str(e))
```

- Create dedicated logger
```python
import logging
from fast_api_cloudwatch import get_logger

logger = get_logger(log_name="log_name", logging_level=logging.WARNING)
```

## Info

Current logger can be extended by adding extra handlers.

```python
# Your app logger.py
import logging
from fast_api_cloudwatch import get_logger

logger = get_logger()

formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

file_handler = logging.FileHandler('path/to/log/file')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)
```

## Features
- Provide a Cloudwatch log handling for storing logs in related CloudWatch log group.
- Sends logs in format provided by JSONFormatter.
- Easy integration with FastAPI application.


## Feature Keywords
- fast-api-cloudwatch
- watchtower
- logging

### Links
[WatchTower logger](https://kislyuk.github.io/watchtower/)

### Relations

- /apps/fast-api-server

### External dependencies

- boto3
- watchtower
- colorlog

