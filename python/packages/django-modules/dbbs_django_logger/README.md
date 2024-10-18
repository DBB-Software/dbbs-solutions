## Name: nestjs-module-logger

## Description

The Logger for Django offers a powerful logging solution tailored for your application's needs. Built upon the watchtower logger adapter, this module introduces custom features to enhance your logging experience.

## Usage

Install `dbbs-django-logger` into your application using poetry.

```bash
poetry add ../../packages/django-modules/dbbs_django_logger
```

## Examples

To use dbbs-django-logger in the Django app import it from packages and provide AWS credentials in settings.

```python
#settings.py
import os

from dbbs_django_logger.logging_config import get_logging_config

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')

LOG_GROUP = os.getenv('LOG_GROUP')
LOG_STREAM = os.getenv('LOG_STREAM')

LOGGING = get_logging_config()

#views.py
from dbbs_django_logger.logger import logger

def example_view(request):
    logger.info("ExampleView GET request")
    ...
```

## Features

- Requests Tracking: The module includes functionality for tracking requests, allowing you to monitor and log incoming requests effectively.
- Logs Transport to AWS CloudWatch: With built-in support for AWS CloudWatch, you can seamlessly transport logs to this storage solution, enabling centralized logging and easy access to log data.

## Feature Keywords

- formatted-logging-messaging
- request-tracking
- log-trace
- aws-cloudwatch-log-transport

## Language and framework

- Python
- Django

## Type

- Module

## Tech Category

- Back-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- bilenko-ha1305

## Links
https://kislyuk.github.io/watchtower/
[Django Logging documentation](https://docs.djangoproject.com/en/2.2/topics/logging)
[WatchTower logger](https://kislyuk.github.io/watchtower/)

## Relations

- /apps/django-server

## External dependencies

- boto3
- watchtower
- django
- colorlog
