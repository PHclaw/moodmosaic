from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from .core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    moods = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    __table_args__ = (UniqueConstraint("user_id", "date", name="uq_user_date"),)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False, index=True)
    mood = Column(String(20), nullable=False)
    color = Column(String(7), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="moods")
