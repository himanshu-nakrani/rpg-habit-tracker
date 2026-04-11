from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import DifficultyEnum, SkillEnum


# Auth schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# User schemas
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    avatar: str
    level: int
    xp: int
    streak: int
    xp_for_next_level: int
    xp_progress: float

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None


# Habit schemas
class HabitCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    difficulty: DifficultyEnum = DifficultyEnum.easy
    skill: SkillEnum = SkillEnum.health


class HabitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[DifficultyEnum] = None
    skill: Optional[SkillEnum] = None
    is_active: Optional[bool] = None


class HabitResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: DifficultyEnum
    skill: SkillEnum
    is_active: bool
    created_at: datetime
    completed_today: bool = False

    class Config:
        from_attributes = True


# HabitLog schemas
class HabitLogCreate(BaseModel):
    habit_id: int


class HabitLogResponse(BaseModel):
    id: int
    habit_id: int
    completed_date: str
    xp_earned: int

    class Config:
        from_attributes = True


# Achievement schemas
class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    category: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Progress schemas
class DailyProgress(BaseModel):
    date: str
    total_habits: int
    completed_habits: int
    progress_percent: float
    xp_earned: int


class LevelUpResponse(BaseModel):
    leveled_up: bool
    new_level: Optional[int] = None
    xp_gained: int


class DashboardResponse(BaseModel):
    user: UserResponse
    habits: List[HabitResponse]
    daily_progress: DailyProgress
    recent_achievements: List[AchievementResponse]
