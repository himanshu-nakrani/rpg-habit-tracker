from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from models import User, Habit, HabitLog
from schemas import HabitCreate, HabitUpdate, HabitResponse
from auth import get_current_user
from xp import DIFFICULTY_XP

router = APIRouter(prefix="/habits", tags=["habits"])

today_str = lambda: date.today().isoformat()


def habit_to_response(habit: Habit, db: Session) -> HabitResponse:
    today = today_str()
    completed_today = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit.id, HabitLog.completed_date == today)
        .first()
        is not None
    )
    return HabitResponse(
        id=habit.id,
        title=habit.title,
        description=habit.description,
        difficulty=habit.difficulty,
        skill=habit.skill,
        is_active=habit.is_active,
        created_at=habit.created_at,
        completed_today=completed_today,
    )


@router.get("/", response_model=list[HabitResponse])
def get_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.is_active == True).all()
    return [habit_to_response(h, db) for h in habits]


@router.post("/", response_model=HabitResponse)
def create_habit(habit_data: HabitCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = Habit(
        user_id=current_user.id,
        title=habit_data.title,
        description=habit_data.description,
        difficulty=habit_data.difficulty,
        skill=habit_data.skill,
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit_to_response(habit, db)


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    habit_data: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    for field, value in habit_data.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)
    return habit_to_response(habit, db)


@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit.is_active = False
    db.commit()
    return {"message": "Habit deactivated"}


@router.post("/{habit_id}/complete")
def complete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = today_str()
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    existing_log = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.completed_date == today)
        .first()
    )
    if existing_log:
        raise HTTPException(status_code=400, detail="Habit already completed today")

    xp_earned = DIFFICULTY_XP.get(habit.difficulty.value, 10)

    log = HabitLog(
        user_id=current_user.id,
        habit_id=habit_id,
        completed_date=today,
        xp_earned=xp_earned,
    )
    db.add(log)

    from xp import xp_required_for_level, check_streak_milestone
    from datetime import datetime, timedelta

    current_user.xp += xp_earned

    while current_user.xp >= xp_required_for_level(current_user.level):
        current_user.xp -= xp_required_for_level(current_user.level)
        current_user.level += 1

    # Update streak
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    if current_user.last_active_date == today:
        pass  # Already active today
    elif current_user.last_active_date == yesterday:
        current_user.streak += 1
    else:
        current_user.streak = 1
    current_user.last_active_date = today

    # Streak bonus
    milestone_hit, bonus_xp = check_streak_milestone(current_user.streak)
    if milestone_hit:
        current_user.xp += bonus_xp
        while current_user.xp >= xp_required_for_level(current_user.level):
            current_user.xp -= xp_required_for_level(current_user.level)
            current_user.level += 1

    db.commit()

    # Check achievements
    from achievements import check_and_award_achievements
    new_achievements = check_and_award_achievements(current_user, db)

    return {
        "xp_earned": xp_earned,
        "new_xp": current_user.xp,
        "new_level": current_user.level,
        "streak": current_user.streak,
        "streak_bonus": bonus_xp if milestone_hit else 0,
        "new_achievements": [
            {"name": a.name, "description": a.description, "icon": a.icon}
            for a in new_achievements
        ],
    }
