from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String
from src.db.base import Base
from typing import List


class MeetingTypeModel(Base):
    """Model for demo purpose."""

    __tablename__ = "meeting_type"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)

    geo: Mapped[List["GeoModel"]] = relationship("GeoModel", back_populates="meeting_type")


from src.db.models.geo import GeoModel # noqa: E402
