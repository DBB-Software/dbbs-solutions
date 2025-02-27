from datetime import datetime
from typing import Tuple
from http import HTTPMethod

from flask import Blueprint, jsonify, Response
from uuid import UUID
from src.api.example.schema import ExampleSchema

example_blueprint = Blueprint("example", __name__, url_prefix="/api/v1/examples")


@example_blueprint.route("/<id>", methods=[HTTPMethod.GET])
def example_endpoint(id: str) -> Tuple[Response, int]:
    """
    Endpoint to retrieve an example by id.

    :param id: Incoming ID as a string.
    :return: JSON response with example data or error for invalid ID.
    """
    request_schema = ExampleSchema()

    errors = request_schema.validate({"id": id})
    if errors:
        return jsonify({"error": "Invalid UUID format."}), 422

    response_data = {
        "id": UUID(id),
        "date": str(datetime.now()),
    }
    return jsonify(response_data), 200
