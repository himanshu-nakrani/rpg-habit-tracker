import { Flame } from "lucide-react";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export default function StreakCounter({ streak }) {
  const nextMilestone = STREAK_MILESTONES.find((m) => m > streak) || 100;
  const progressToNext = ((streak % nextMilestone) / nextMilestone) * 100;

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
      <style>{`
        .streak-container {
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          border: 1px solid #4338ca;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .streak-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .streak-icon {
          color: #ef4444;
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.5));
        }
        .streak-fire {
          animation: fire-pulse 1.5s ease-in-out infinite;
        }
        @keyframes fire-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.5)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.8)); }
        }
        .streak-count {
          font-size: 2rem;
          font-weight: 900;
          color: #f97316;
          line-height: 1;
          text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
        }
        .streak-label {
          display: block;
          font-size: 0.7rem;
          color: #a5b4fc;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .streak-progress-track {
          width: 100%;
          height: 4px;
          background: #1e1b4b;
          border-radius: 2px;
          margin: 8px 0 4px;
          overflow: hidden;
        }
        .streak-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ef4444, #f97316);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .streak-milestone {
          font-size: 0.65rem;
          color: #6366f1;
        }
      `}</style>
    </div>
  );
}
