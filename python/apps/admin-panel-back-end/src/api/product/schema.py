from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from src.api.type.schema import Type


class Product(BaseModel):
    id: Optional[int] = None
    type_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = "USD"
    sku: Optional[str] = None
    inventory_count: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    type: Optional[Type] = None

    model_config = ConfigDict(from_attributes=True, alias_generator=to_camel, populate_by_name=True)


class ProductCreate(Product):
    name: str
