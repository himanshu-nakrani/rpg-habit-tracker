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


@router.get("/{habit_id}/insights")
def get_habit_insights(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from datetime import timedelta
    from sqlalchemy import func

    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date.today()
    logs = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.user_id == current_user.id)
        .order_by(HabitLog.completed_date.asc())
        .all()
    )

    total_completions = len(logs)
    total_xp = sum(l.xp_earned for l in logs)

    # Completion rates for last 7 and 30 days
    def rate_for_days(n):
        cutoff = (today - timedelta(days=n)).isoformat()
        count = sum(1 for l in logs if l.completed_date > cutoff)
        return min(round(count / n * 100, 1), 100)  # Cap at 100%

    rate_7d = rate_for_days(7)
    rate_30d = rate_for_days(30)

    # Current streak & best streak for this specific habit
    dates_set = set(l.completed_date for l in logs)
    current_streak = 0
    d = today
    while d.isoformat() in dates_set:
        current_streak += 1
        d -= timedelta(days=1)

    # If not completed today, check yesterday-back
    if current_streak == 0:
        d = today - timedelta(days=1)
        while d.isoformat() in dates_set:
            current_streak += 1
            d -= timedelta(days=1)

    best_streak = 0
    streak = 0
    if logs:
        sorted_dates = sorted(dates_set)
        prev = None
        for ds in sorted_dates:
            d_obj = date.fromisoformat(ds)
            if prev and (d_obj - prev).days == 1:
                streak += 1
            else:
                streak = 1
            best_streak = max(best_streak, streak)
            prev = d_obj

    # Last 14 days heatmap data
    last_14 = []
    for i in range(13, -1, -1):
        d = today - timedelta(days=i)
        ds = d.isoformat()
        completed = ds in dates_set
        xp = next((l.xp_earned for l in logs if l.completed_date == ds), 0)
        last_14.append({"date": ds, "completed": completed, "xp": xp, "day": d.strftime("%a")})

    # Power score (0-100) based on consistency
    days_since_creation = max((today - habit.created_at.date()).days, 1) if habit.created_at else 30
    consistency = min(total_completions / days_since_creation, 1.0)
    power_score = int(consistency * 100)

    return {
        "habit_id": habit.id,
        "title": habit.title,
        "difficulty": habit.difficulty.value,
        "skill": habit.skill.value,
        "total_completions": total_completions,
        "total_xp": total_xp,
        "current_streak": current_streak,
        "best_streak": best_streak,
        "rate_7d": rate_7d,
        "rate_30d": rate_30d,
        "power_score": power_score,
        "last_14_days": last_14,
        "created_at": habit.created_at.isoformat() if habit.created_at else None,
    }


@router.post("/{habit_id}/complete")
def complete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import random
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

    from xp import xp_required_for_level, check_streak_milestone
    from datetime import datetime, timedelta

    base_xp = DIFFICULTY_XP.get(habit.difficulty.value, 10)

    # --- COMBO SYSTEM: more habits completed today = higher multiplier ---
    completions_today = (
        db.query(HabitLog)
        .filter(HabitLog.user_id == current_user.id, HabitLog.completed_date == today)
        .count()
    )
    combo = completions_today  # 0-indexed: first completion = combo 0
    combo_multiplier = 1.0 + (combo * 0.15)  # +15% per combo: 1x, 1.15x, 1.3x, 1.45x...
    combo_bonus = int(base_xp * (combo_multiplier - 1.0))

    # --- CRITICAL HIT: 12% chance of 2x XP ---
    is_critical = random.random() < 0.12
    crit_multiplier = 2.0 if is_critical else 1.0

    # --- STREAK XP MULTIPLIER: longer streaks = passive boost ---
    streak_mult = 1.0 + (min(current_user.streak, 30) * 0.02)  # up to +60% at 30-day streak

    xp_earned = int(base_xp * combo_multiplier * crit_multiplier * streak_mult)

    log = HabitLog(
        user_id=current_user.id,
        habit_id=habit_id,
        completed_date=today,
        xp_earned=xp_earned,
    )
    db.add(log)

    level_before = current_user.level
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

    # Streak milestone bonus
    milestone_hit, milestone_bonus_xp = check_streak_milestone(current_user.streak)
    if milestone_hit:
        current_user.xp += milestone_bonus_xp
        while current_user.xp >= xp_required_for_level(current_user.level):
            current_user.xp -= xp_required_for_level(current_user.level)
            current_user.level += 1

    # --- PERFECT DAY BONUS: all habits completed ---
    # Flush to ensure the new log is counted
    db.flush()
    total_active = db.query(Habit).filter(
        Habit.user_id == current_user.id, Habit.is_active == True
    ).count()
    # Use distinct habit count to avoid counting same habit twice
    completed_today_count = (
        db.query(HabitLog.habit_id)
        .filter(
            HabitLog.user_id == current_user.id,
            HabitLog.completed_date == today
        )
        .distinct()
        .count()
    )
    is_perfect_day = completed_today_count >= total_active and total_active > 0
    perfect_day_bonus = 0
    if is_perfect_day:
        perfect_day_bonus = 50 + (current_user.level * 10)  # scales with level
        current_user.xp += perfect_day_bonus
        while current_user.xp >= xp_required_for_level(current_user.level):
            current_user.xp -= xp_required_for_level(current_user.level)
            current_user.level += 1

    leveled_up = current_user.level > level_before

    db.commit()

    # Check achievements
    from achievements import check_and_award_achievements
    new_achievements = check_and_award_achievements(current_user, db)

    return {
        "xp_earned": xp_earned,
        "base_xp": base_xp,
        "combo": combo + 1,
        "combo_bonus": combo_bonus,
        "is_critical": is_critical,
        "crit_multiplier": crit_multiplier,
        "streak_multiplier": round(streak_mult, 2),
        "perfect_day": is_perfect_day,
        "perfect_day_bonus": perfect_day_bonus,
        "new_xp": current_user.xp,
        "new_level": current_user.level,
        "leveled_up": leveled_up,
        "streak": current_user.streak,
        "streak_bonus": milestone_bonus_xp if milestone_hit else 0,
        "new_achievements": [
            {"name": a.name, "description": a.description, "icon": a.icon}
            for a in new_achievements
        ],
    }


@router.delete("/{habit_id}/complete")
def uncomplete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from datetime import timedelta
    from xp import xp_required_for_level, check_streak_milestone

    today = today_str()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    log = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.user_id == current_user.id, HabitLog.completed_date == today)
        .first()
    )
    if not log:
        raise HTTPException(status_code=400, detail="Habit not completed today")

    xp_to_remove = log.xp_earned

    # Check if this was the only completion today - if so, revert streak
    completions_remaining = (
        db.query(HabitLog)
        .filter(
            HabitLog.user_id == current_user.id,
            HabitLog.completed_date == today,
            HabitLog.habit_id != habit_id
        )
        .count()
    )
    streak_reverted = False
    if completions_remaining == 0:
        # This was the last completion of the day, revert streak
        if current_user.streak > 0:
            current_user.streak -= 1
            streak_reverted = True

    # Check for perfect day bonus reversal
    # If all habits are now incomplete, we need to remove perfect day bonus
    total_active = db.query(Habit).filter(
        Habit.user_id == current_user.id, Habit.is_active == True
    ).count()
    remaining_completions = (
        db.query(HabitLog)
        .filter(
            HabitLog.user_id == current_user.id,
            HabitLog.completed_date == today
        )
        .count()
    )
    perfect_day_bonus_removed = 0
    if remaining_completions == 0 and total_active > 0:
        # Was a perfect day, remove the bonus
        perfect_day_bonus_removed = 50 + (current_user.level * 10)
        # Adjust for current level (bonus scales with level at time of award)
        # We approximate by removing based on current level
        current_user.xp -= perfect_day_bonus_removed

    total_xp_to_remove = xp_to_remove + perfect_day_bonus_removed
    current_user.xp -= xp_to_remove

    # Handle level downgrade
    while current_user.xp < 0 and current_user.level > 1:
        current_user.level -= 1
        current_user.xp += xp_required_for_level(current_user.level)

    # Ensure xp doesn't go negative at level 1
    if current_user.xp < 0:
        current_user.xp = 0

    db.delete(log)
    db.commit()

    return {
        "message": "Habit completion undone",
        "xp_removed": total_xp_to_remove,
        "streak_reverted": streak_reverted,
        "perfect_day_bonus_removed": perfect_day_bonus_removed,
        "new_xp": current_user.xp,
        "new_level": current_user.level,
        "new_streak": current_user.streak,
    }
