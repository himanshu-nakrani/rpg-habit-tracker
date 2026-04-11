import math

DIFFICULTY_XP = {
    "easy": 10,
    "medium": 25,
    "hard": 50,
}

STREAK_BONUSES = {
    3: 20,
    7: 50,
    14: 100,
    30: 250,
    60: 500,
    100: 1000,
}


def xp_required_for_level(level: int) -> int:
    return int(100 * (level ** 1.5))


def calculate_level(xp: int) -> int:
    level = 1
    while xp >= xp_required_for_level(level):
        xp -= xp_required_for_level(level)
        level += 1
    return level


def get_xp_progress(xp: int, level: int) -> dict:
    total_xp_needed = xp_required_for_level(level)
    return {
        "xp_for_next_level": total_xp_needed,
        "xp_progress": min(xp / total_xp_needed, 1.0) if total_xp_needed > 0 else 0,
    }


def get_streak_bonus(streak: int) -> int:
    bonus = 0
    for milestone, bonus_xp in STREAK_BONUSES.items():
        if streak >= milestone:
            bonus = bonus_xp
    return bonus


def check_streak_milestone(streak: int) -> tuple[bool, int]:
    if streak in STREAK_BONUSES:
        return True, STREAK_BONUSES[streak]
    return False, 0
