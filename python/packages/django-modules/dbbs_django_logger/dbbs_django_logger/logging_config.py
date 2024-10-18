from .json_formatter import JSONFormatter


def get_logging_config():
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "json",
            },
            "cloudwatch": {
                "class": "dbbs_django_logger.cloud_watch_handler.CloudWatchHandler",
                "formatter": "json",
            },
        },
        "root": {
            "handlers": ["console", "cloudwatch"],
            "level": "WARNING",
        },
        "loggers": {
            "django": {
                "handlers": ["console", "cloudwatch"],
                "level": "INFO",
                "propagate": False,
            },
        },
        "formatters": {
            "json": {
                "()": JSONFormatter,
            },
        },
    }
