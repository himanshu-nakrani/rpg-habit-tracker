from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, Base
from models import User, Habit, HabitLog, Achievement, UserAchievement
from auth import router as auth_router
from habits import router as habits_router
from progress import router as progress_router
from achievements import router as achievements_router, seed_achievements

app = FastAPI(title="RPG Habit Tracker", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_achievements(db)
finally:
    db.close()

app.include_router(auth_router)
app.include_router(habits_router)
app.include_router(progress_router)
app.include_router(achievements_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to RPG Habit Tracker API", "version": "1.0.0"}
