from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from database import get_db
from models import User, Habit, HabitLog, Achievement, UserAchievement
from schemas import DailyProgress, AchievementResponse, DashboardResponse
from auth import get_current_user, user_to_response
from xp import xp_required_for_level, get_xp_progress, check_streak_milestone, STREAK_BONUSES

router = APIRouter(prefix="/progress", tags=["progress"])


def update_streak(user: User, db: Session) -> dict:
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    if user.last_active_date == today:
        return {"streak": user.streak, "milestone_bonus": 0}

    if user.last_active_date == yesterday:
        user.streak += 1
    elif user.last_active_date != today:
        user.streak = 1

    user.last_active_date = today

    milestone_hit, bonus_xp = check_streak_milestone(user.streak)
    if milestone_hit:
        user.xp += bonus_xp
        while user.xp >= xp_required_for_level(user.level):
            user.xp -= xp_required_for_level(user.level)
            user.level += 1

    db.commit()
    db.refresh(user)
    return {"streak": user.streak, "milestone_bonus": bonus_xp if milestone_hit else 0}


@router.get("/daily", response_model=DailyProgress)
def get_daily_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today().isoformat()

    total_habits = db.query(Habit).filter(
        Habit.user_id == current_user.id, Habit.is_active == True
    ).count()

    completed_habits = (
        db.query(HabitLog)
        .filter(HabitLog.user_id == current_user.id, HabitLog.completed_date == today)
        .count()
    )

    xp_earned = (
        db.query(func.coalesce(func.sum(HabitLog.xp_earned), 0))
        .filter(HabitLog.user_id == current_user.id, HabitLog.completed_date == today)
        .scalar()
    )

    progress_percent = (completed_habits / total_habits * 100) if total_habits > 0 else 0

    return DailyProgress(
        date=today,
        total_habits=total_habits,
        completed_habits=completed_habits,
        progress_percent=progress_percent,
        xp_earned=xp_earned,
    )


@router.get("/achievements", response_model=list[AchievementResponse])
def get_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    all_achievements = db.query(Achievement).all()
    user_achievements = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == current_user.id)
        .all()
    )
    unlocked_map = {ua.achievement_id: ua for ua in user_achievements}

    result = []
    for ach in all_achievements:
        ua = unlocked_map.get(ach.id)
        result.append(
            AchievementResponse(
                id=ach.id,
                name=ach.name,
                description=ach.description,
                icon=ach.icon,
                category=ach.category,
                unlocked=ua is not None,
                unlocked_at=ua.unlocked_at if ua else None,
            )
        )
    return result


@router.get("/streak-info")
def get_streak_info(current_user: User = Depends(get_current_user)):
    return {
        "streak": current_user.streak,
        "last_active": current_user.last_active_date,
        "next_milestone": next(
            (m for m in sorted(STREAK_BONUSES.keys()) if m > current_user.streak), None
        ),
    }


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from habits import habit_to_response

    streak_info = update_streak(current_user, db)
    db.refresh(current_user)

    habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.is_active == True).all()
    habit_responses = [habit_to_response(h, db) for h in habits]

    today = date.today().isoformat()
    total_habits = len(habits)
    completed_habits = sum(1 for h in habit_responses if h.completed_today)
    xp_earned = (
        db.query(func.coalesce(func.sum(HabitLog.xp_earned), 0))
        .filter(HabitLog.user_id == current_user.id, HabitLog.completed_date == today)
        .scalar()
    )
    progress_percent = (completed_habits / total_habits * 100) if total_habits > 0 else 0

    daily_progress = DailyProgress(
        date=today,
        total_habits=total_habits,
        completed_habits=completed_habits,
        progress_percent=progress_percent,
        xp_earned=xp_earned,
    )

    recent_achievements_data = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == current_user.id)
        .order_by(UserAchievement.unlocked_at.desc())
        .limit(5)
        .all()
    )
    recent_achievements = []
    for ua in recent_achievements_data:
        ach = ua.achievement
        recent_achievements.append(
            AchievementResponse(
                id=ach.id,
                name=ach.name,
                description=ach.description,
                icon=ach.icon,
                category=ach.category,
                unlocked=True,
                unlocked_at=ua.unlocked_at,
            )
        )

    return DashboardResponse(
        user=user_to_response(current_user),
        habits=habit_responses,
        daily_progress=daily_progress,
        recent_achievements=recent_achievements,
    )
