import { AlertTriangle, Flame } from "lucide-react";

export default function StreakDanger({ streak, completedToday }) {
  if (streak <= 0 || completedToday > 0) return null;

  return (
    <div className="streak-danger">
      <div className="streak-danger-pulse" />
      <div className="streak-danger-content">
        <AlertTriangle size={20} className="streak-danger-icon" />
        <div className="streak-danger-text">
          <span className="streak-danger-title">Streak in Danger!</span>
          <span className="streak-danger-sub">
            Complete a quest to keep your <strong>{streak}-day</strong> streak alive!
          </span>
        </div>
        <Flame size={24} className="streak-danger-flame" />
      </div>
    </div>
  );
}
