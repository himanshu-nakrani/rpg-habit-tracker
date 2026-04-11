import { Flame, Zap } from "lucide-react";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export default function StreakCounter({ streak }) {
  const nextMilestone = STREAK_MILESTONES.find((m) => m > streak);
  const maxMilestone = STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  
  // For streaks past max milestone, show 100% and indicate maxed
  if (streak >= maxMilestone) {
    return (
      <div className="streak-container">
        <div className="streak-inner">
          <div className="streak-icon streak-fire">
            <Flame size={28} />
          </div>
          <div className="streak-info">
            <span className="streak-count">{streak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
        <div className="streak-progress-track">
          <div
            className="streak-progress-fill"
            style={{ width: '100%' }}
          />
        </div>
        <span className="streak-milestone">MAX STREAK!</span>
        {streak > 0 && (
          <div className="streak-multiplier">
            <span className="streak-mult-icon"><Zap size={12} /></span>
            <span className="streak-mult-text">+60% XP Bonus (Max)</span>
          </div>
        )}
      </div>
    );
  }
  
  const progressToNext = nextMilestone ? ((streak % nextMilestone) / nextMilestone) * 100 : 0;

  return (
    <div className="streak-container">
      <div className="streak-inner">
        <div className={`streak-icon ${streak >= 7 ? "streak-fire" : ""}`}>
          <Flame size={28} />
        </div>
        <div className="streak-info">
          <span className="streak-count">{streak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
      </div>
      <div className="streak-progress-track">
        <div
          className="streak-progress-fill"
          style={{ width: `${progressToNext}%` }}
        />
      </div>
      <span className="streak-milestone">Next: {nextMilestone} days</span>
      {streak > 0 && (
        <div className="streak-multiplier">
          <span className="streak-mult-icon"><Zap size={12} /></span>
          <span className="streak-mult-text">+{Math.min(streak, 30) * 2}% XP Bonus</span>
        </div>
      )}
    </div>
  );
}
