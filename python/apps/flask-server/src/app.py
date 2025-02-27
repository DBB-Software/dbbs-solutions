from typing import Optional

from flask import Flask
from src.api import example_blueprint
from src.config import TestConfig


def create_app(config_class: Optional[TestConfig] = None) -> Flask:
    app = Flask(__name__)

    # Load configuration into the app
    if config_class:
        app.config.from_object(config_class)

    app.register_blueprint(example_blueprint)

    return app
