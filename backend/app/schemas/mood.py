from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MoodCreate(BaseModel):
    date: date
    mood: str
    color: str
    note: Optional[str] = None

class MoodOut(BaseModel):
    id: int
    date: date
    mood: str
    color: str
    note: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class MoodInsight(BaseModel):
    period: str
    dominant_mood: str
    mood_distribution: dict
    streak_days: int
    summary: str
