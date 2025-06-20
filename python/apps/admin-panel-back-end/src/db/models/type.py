from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String
from src.db.base import Base
from typing import List


class TypeModel(Base):
    """Model for demo purpose."""

    __tablename__ = "type"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)

    product: Mapped[List["ProductModel"]] = relationship("ProductModel", back_populates="type")


from src.db.models.product import ProductModel # noqa: E402
