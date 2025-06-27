from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String, Integer, Boolean

from src.db.base import Base
from datetime import datetime
from typing import Optional


class ProductModel(Base):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True, unique=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[Optional[float]] = mapped_column(nullable=True)
    currency: Mapped[Optional[str]] = mapped_column(String(10), nullable=True, default="USD")
    sku: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    inventory_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True, default=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    type_id: Mapped[int] = mapped_column(ForeignKey("type.id"), nullable=True)

    type: Mapped["TypeModel"] = relationship("TypeModel", remote_side="TypeModel.id", back_populates="product", lazy='joined')




from src.db.models.type import TypeModel  # noqa: E402
