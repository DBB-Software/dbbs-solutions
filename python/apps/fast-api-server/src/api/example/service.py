from datetime import datetime
from uuid import UUID
from fast_api_cloudwatch import get_logger

from src.api.example.schema import Example

logger = get_logger()


class ExampleService:
    @staticmethod
    def get_example(id: UUID) -> Example:
        logger.debug(f"ExampleService - get_example - id = {id}")
        return Example(id=id, date=str(datetime.now()))


async def get_example_service() -> ExampleService:
    return ExampleService()
