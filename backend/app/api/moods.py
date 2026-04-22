from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, timedelta
from .core.database import get_db
from .api.auth import get_current_user
from .models.models import User, MoodEntry
from .schemas.mood import MoodCreate, MoodOut, MoodInsight
from .services.ai import analyze_mood_trend

router = APIRouter(prefix="/moods", tags=["moods"])

@router.post("/", response_model=MoodOut)
async def upsert_mood(data: MoodCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MoodEntry).where(MoodEntry.user_id == user.id, MoodEntry.date == data.date))
    entry = result.scalar_one_or_none()
    if entry:
        entry.mood = data.mood
        entry.color = data.color
        entry.note = data.note
    else:
        entry = MoodEntry(user_id=user.id, date=data.date, mood=data.mood, color=data.color, note=data.note)
        db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry

@router.get("/calendar", response_model=list[MoodOut])
async def get_calendar(year: int, month: int = None, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    start = date(year, 1, 1) if not month else date(year, month, 1)
    if month:
        end = date(year, month + 1, 1) if month < 12 else date(year + 1, 1, 1)
    else:
        end = date(year + 1, 1, 1)
    result = await db.execute(
        select(MoodEntry)
        .where(MoodEntry.user_id == user.id, MoodEntry.date >= start, MoodEntry.date < end)
        .order_by(MoodEntry.date)
    )
    return result.scalars().all()

@router.get("/today", response_model=MoodOut | None)
async def get_today(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MoodEntry).where(MoodEntry.user_id == user.id, MoodEntry.date == date.today()))
    return result.scalar_one_or_none()

@router.get("/insight", response_model=MoodInsight)
async def get_insight(period: str = "weekly", user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    days = 7 if period == "weekly" else 30
    since = date.today() - timedelta(days=days)
    result = await db.execute(
        select(MoodEntry)
        .where(MoodEntry.user_id == user.id, MoodEntry.date >= since)
        .order_by(MoodEntry.date)
    )
    entries = result.scalars().all()
    mood_data = [{"date": str(e.date), "mood": e.mood, "color": e.color, "note": e.note} for e in entries]
    dist = {}
    for e in entries:
        dist[e.mood] = dist.get(e.mood, 0) + 1
    dominant = max(dist, key=dist.get) if dist else "neutral"
    streak = 0
    check = date.today()
    mood_dates = {e.date for e in entries}
    while check in mood_dates:
        streak += 1
        check -= timedelta(days=1)
    summary = await analyze_mood_trend(mood_data, period)
    return MoodInsight(
        period=period, dominant_mood=dominant, mood_distribution=dist,
        streak_days=streak, summary=summary
    )
