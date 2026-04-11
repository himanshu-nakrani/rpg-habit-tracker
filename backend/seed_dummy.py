"""Seed dummy data for test user: test@test.com / test123"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, timedelta, datetime
from database import SessionLocal, engine, Base
from models import User, Habit, HabitLog, Achievement, UserAchievement, DifficultyEnum, SkillEnum
from auth import pwd_context
from xp import DIFFICULTY_XP, xp_required_for_level

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --- 1. Create or get user ---
EMAIL = "test@test.com"
PASSWORD = "test123"
USERNAME = "TestHero"

user = db.query(User).filter(User.email == EMAIL).first()
if user:
    print(f"User '{EMAIL}' already exists (id={user.id}). Clearing old data...")
    db.query(HabitLog).filter(HabitLog.user_id == user.id).delete()
    db.query(UserAchievement).filter(UserAchievement.user_id == user.id).delete()
    db.query(Habit).filter(Habit.user_id == user.id).delete()
    user.xp = 0
    user.level = 1
    user.streak = 0
    user.last_active_date = None
    user.avatar = "warrior"
    user.username = USERNAME
    db.commit()
else:
    user = User(
        username=USERNAME,
        email=EMAIL,
        hashed_password=pwd_context.hash(PASSWORD),
        avatar="warrior",
        level=1,
        xp=0,
        streak=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"Created user '{EMAIL}' (id={user.id})")

# --- 2. Seed achievements if missing ---
from achievements import ACHIEVEMENTS_SEED, seed_achievements
seed_achievements(db)

# --- 3. Create habits ---
HABITS = [
    ("Morning Workout", "30 min exercise before breakfast", DifficultyEnum.medium, SkillEnum.health),
    ("Read 20 Pages", "Read non-fiction book", DifficultyEnum.easy, SkillEnum.mind),
    ("Practice Coding", "LeetCode or side project for 1 hour", DifficultyEnum.hard, SkillEnum.career),
    ("Meditate 10 min", "Guided meditation session", DifficultyEnum.easy, SkillEnum.mind),
    ("Call a Friend", "Stay in touch with someone", DifficultyEnum.easy, SkillEnum.social),
    ("Sketch Something", "Quick creative drawing", DifficultyEnum.medium, SkillEnum.creativity),
]

habits = []
for title, desc, diff, skill in HABITS:
    h = Habit(
        user_id=user.id,
        title=title,
        description=desc,
        difficulty=diff,
        skill=skill,
        is_active=True,
    )
    db.add(h)
    habits.append(h)

db.commit()
for h in habits:
    db.refresh(h)

print(f"Created {len(habits)} habits")

# --- 4. Generate completion history (last 60 days) ---
import random
random.seed(42)

today = date.today()
total_xp = 0
total_logs = 0

for day_offset in range(60, -1, -1):  # 60 days ago through today
    d = today - timedelta(days=day_offset)
    date_str = d.isoformat()

    # Randomly complete 2-5 habits per day (skip some days for realism)
    if random.random() < 0.15:  # 15% chance of skipping a day
        continue

    num_to_complete = random.randint(2, min(5, len(habits)))
    chosen = random.sample(habits, num_to_complete)

    for habit in chosen:
        xp = DIFFICULTY_XP.get(habit.difficulty.value, 10)
        log = HabitLog(
            user_id=user.id,
            habit_id=habit.id,
            completed_date=date_str,
            xp_earned=xp,
        )
        db.add(log)
        total_xp += xp
        total_logs += 1

db.commit()
print(f"Created {total_logs} habit logs over ~60 days ({total_xp} total XP)")

# --- 5. Calculate final user level/xp ---
user.xp = 0
user.level = 1
remaining_xp = total_xp

while remaining_xp >= xp_required_for_level(user.level):
    remaining_xp -= xp_required_for_level(user.level)
    user.level += 1

user.xp = remaining_xp

# --- 6. Calculate streak from today backwards ---
streak = 0
check_date = today
while True:
    ds = check_date.isoformat()
    has_log = db.query(HabitLog).filter(
        HabitLog.user_id == user.id, HabitLog.completed_date == ds
    ).first()
    if has_log:
        streak += 1
        check_date -= timedelta(days=1)
    else:
        break

user.streak = streak
user.last_active_date = today.isoformat()
db.commit()

print(f"User stats: Level {user.level}, {user.xp} XP, {user.streak}-day streak")

# --- 7. Award achievements ---
from achievements import check_and_award_achievements
awarded = check_and_award_achievements(user, db)
print(f"Awarded {len(awarded)} achievements: {[a.name for a in awarded]}")

db.close()
print("\nDone! Login with test@test.com / test123")
