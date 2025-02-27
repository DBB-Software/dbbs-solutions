from marshmallow import Schema, fields


class ExampleSchema(Schema):
    """
    Simple example schema.
    """

    id = fields.UUID(required=True)
