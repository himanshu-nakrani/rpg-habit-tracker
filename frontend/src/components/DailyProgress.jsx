export default function DailyProgress({ progress }) {
  if (!progress) return null;

  const percent = Math.round(progress.progress_percent);

  return (
    <div className="daily-progress-container">
      <div className="daily-progress-header">
        <span className="daily-progress-title">Daily Quest Progress</span>
        <span className="daily-progress-count">
          {progress.completed_habits}/{progress.total_habits}
        </span>
      </div>
      <div className="daily-progress-track">
        <div
          className={`daily-progress-fill ${percent === 100 ? "daily-complete" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="daily-progress-footer">
        <span className="daily-progress-percent">{percent}%</span>
        <span className="daily-progress-xp">+{progress.xp_earned} XP earned</span>
      </div>

      <style>{`
        .daily-progress-container {
          background: linear-gradient(135deg, #0c0a1a, #1a1033);
          border: 1px solid #2d2250;
          border-radius: 12px;
          padding: 16px;
        }
        .daily-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .daily-progress-title {
          font-size: 0.8rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .daily-progress-count {
          font-size: 0.85rem;
          color: #e2e8f0;
          font-weight: 700;
        }
        .daily-progress-track {
          width: 100%;
          height: 12px;
          background: #0c0a1a;
          border-radius: 6px;
          border: 1px solid #2d2250;
          overflow: hidden;
        }
        .daily-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          border-radius: 5px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .daily-complete {
          background: linear-gradient(90deg, #22c55e, #4ade80) !important;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
        }
        .daily-progress-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }
        .daily-progress-percent {
          font-size: 0.75rem;
          color: #c4b5fd;
          font-weight: 600;
        }
        .daily-progress-xp {
          font-size: 0.75rem;
          color: #fbbf24;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
