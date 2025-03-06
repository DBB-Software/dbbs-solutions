from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class Geo(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    capture_schedule_flag: Optional[bool] = None
    capture_stream_flag: Optional[bool] = None
    meeting_type_id: Optional[int] = None
    schedule_url: Optional[str] = None
    timezone: Optional[str] = None
    schedule_format: Optional[str] = None
    jurisdiction: Optional[bool] = None
    channel_url: Optional[str] = None
    status_schedule: Optional[str] = None
    status_stream: Optional[str] = None
    flag_only_agenda: Optional[bool] = None
    flag_opt_in_only: Optional[bool] = None
    single_player_url: Optional[str] = None
    flag_live: Optional[bool] = None
    detect_end_method: Optional[str] = None
    detect_start_method: Optional[str] = None
    detect_end_ocr_string: Optional[str] = None
    debug: Optional[bool] = None
    demo: Optional[bool] = None
    geo_parent_id: Optional[int] = None
    schedule_refresh_frequency: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    parent: Optional["Geo"] = None

    model_config = ConfigDict(from_attributes=True, alias_generator=to_camel, populate_by_name=True)


class GeoCreate(Geo):
    name: str
