from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import String, Integer, Boolean

from src.db.base import Base


class GeoModel(Base):
    __tablename__ = "geo"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    capture_schedule_flag: Mapped[bool] = mapped_column(Boolean, nullable=True)
    capture_stream_flag: Mapped[bool] = mapped_column(Boolean, nullable=True)
    meeting_type_id: Mapped[int] = mapped_column(ForeignKey("meeting_type.id"), nullable=True)
    schedule_url: Mapped[str] = mapped_column(String(500), nullable=True)
    timezone: Mapped[str] = mapped_column(String(200), nullable=True)
    schedule_format: Mapped[str] = mapped_column(String(200), nullable=True)
    jurisdiction: Mapped[bool] = mapped_column(Boolean, nullable=True)
    channel_url: Mapped[str] = mapped_column(String(500), nullable=True)
    status_schedule: Mapped[str] = mapped_column(String(200), nullable=True)
    status_stream: Mapped[str] = mapped_column(String(50), nullable=True)
    flag_only_agenda: Mapped[bool] = mapped_column(Boolean, nullable=True)
    flag_opt_in_only: Mapped[bool] = mapped_column(Boolean, nullable=True)
    single_player_url: Mapped[str] = mapped_column(String(500), nullable=True)
    flag_live: Mapped[bool] = mapped_column(Boolean, nullable=True)
    detect_end_method: Mapped[str] = mapped_column(String(100), nullable=True)
    detect_start_method: Mapped[str] = mapped_column(String(100), nullable=True)
    detect_end_ocr_string: Mapped[str] = mapped_column(String(200), nullable=True)
    debug: Mapped[bool] = mapped_column(Boolean, nullable=True)
    demo: Mapped[bool] = mapped_column(Boolean, nullable=True)
    schedule_refresh_frequency: Mapped[int] = mapped_column(Integer, nullable=True)

    meeting_type: Mapped["MeetingTypeModel"] = relationship("MeetingTypeModel", back_populates="geo", lazy='joined')
    parent: Mapped["GeoModel"] = relationship("GeoModel", remote_side="GeoModel.id", back_populates="children", lazy='joined')
    children: Mapped[list["GeoModel"]] = relationship("GeoModel", back_populates="parent", lazy='joined')

    geo_parent_id: Mapped[int] = mapped_column(ForeignKey("geo.id"), nullable=True)


from src.db.models.meeting_type import MeetingTypeModel  # noqa: E402
