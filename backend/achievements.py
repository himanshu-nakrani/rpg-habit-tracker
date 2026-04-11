from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User, Achievement, UserAchievement, HabitLog, DifficultyEnum
from auth import get_current_user

router = APIRouter(prefix="/xp", tags=["xp"])

ACHIEVEMENTS_SEED = [
    {"name": "First Step", "description": "Complete your first habit", "icon": "🎯", "category": "habits"},
    {"name": "Week Warrior", "description": "Reach a 7-day streak", "icon": "🔥", "category": "streak"},
    {"name": "Monthly Master", "description": "Reach a 30-day streak", "icon": "⚡", "category": "streak"},
    {"name": "Apprentice", "description": "Reach Level 5", "icon": "📜", "category": "level"},
    {"name": "Journeyman", "description": "Reach Level 10", "icon": "🛡️", "category": "level"},
    {"name": "Expert", "description": "Reach Level 25", "icon": "⚔️", "category": "level"},
    {"name": "Legend", "description": "Reach Level 50", "icon": "👑", "category": "level"},
    {"name": "Habit Hunter", "description": "Complete 10 habits total", "icon": "🏹", "category": "habits"},
    {"name": "Quest Master", "description": "Complete 50 habits total", "icon": "🏰", "category": "habits"},
    {"name": "Hard Mode", "description": "Complete a Hard difficulty habit", "icon": "💀", "category": "habits"},
    {"name": "Triple Threat", "description": "Reach a 3-day streak", "icon": "🌟", "category": "streak"},
    {"name": "Fortnight Fighter", "description": "Reach a 14-day streak", "icon": "🗡️", "category": "streak"},
]


def seed_achievements(db: Session):
    for ach_data in ACHIEVEMENTS_SEED:
        existing = db.query(Achievement).filter(Achievement.name == ach_data["name"]).first()
        if not existing:
            achievement = Achievement(**ach_data)
            db.add(achievement)
    db.commit()


def check_and_award_achievements(user: User, db: Session):
    new_achievements = []

    unlocked_ids = {
        ua.achievement_id
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    total_completions = db.query(HabitLog).filter(HabitLog.user_id == user.id).count()

    conditions = {
        "First Step": total_completions >= 1,
        "Habit Hunter": total_completions >= 10,
        "Quest Master": total_completions >= 50,
        "Hard Mode": (
            db.query(HabitLog)
            .join(HabitLog.habit)
            .filter(HabitLog.user_id == user.id, HabitLog.habit.has(difficulty=DifficultyEnum.hard))
            .first()
            is not None
        ),
        "Week Warrior": user.streak >= 7,
        "Monthly Master": user.streak >= 30,
        "Triple Threat": user.streak >= 3,
        "Fortnight Fighter": user.streak >= 14,
        "Apprentice": user.level >= 5,
        "Journeyman": user.level >= 10,
        "Expert": user.level >= 25,
        "Legend": user.level >= 50,
    }

    for name, condition in conditions.items():
        if condition:
            achievement = db.query(Achievement).filter(Achievement.name == name).first()
            if achievement and achievement.id not in unlocked_ids:
                ua = UserAchievement(user_id=user.id, achievement_id=achievement.id)
                db.add(ua)
                new_achievements.append(achievement)

    if new_achievements:
        db.commit()

    return new_achievements


@router.get("/stats")
def get_xp_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from xp import xp_required_for_level, get_xp_progress

    progress = get_xp_progress(current_user.xp, current_user.level)
    total_completions = db.query(HabitLog).filter(HabitLog.user_id == current_user.id).count()

    return {
        "level": current_user.level,
        "xp": current_user.xp,
        "xp_for_next_level": progress["xp_for_next_level"],
        "xp_progress": progress["xp_progress"],
        "streak": current_user.streak,
        "total_completions": total_completions,
    }
