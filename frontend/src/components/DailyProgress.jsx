export default function DailyProgress({ progress }) {
  if (!progress) return null;

  const percent = Math.round(progress.progress_percent);
  const isPerfect = percent === 100 && progress.total_habits > 0;

  return (
    <div className={`daily-progress-container ${isPerfect ? "daily-progress-perfect" : ""}`}>
      <div className="daily-progress-header">
        <span className="daily-progress-title">
          {isPerfect ? "Perfect Day" : "Today’s Progress"}
        </span>
        <span className="daily-progress-count">
          {progress.completed_habits}/{progress.total_habits}
        </span>
      </div>
      <div
        aria-label="Daily quest completion"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className="daily-progress-track"
        role="progressbar"
      >
        <div
          className={`daily-progress-fill ${percent === 100 ? "daily-complete" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="daily-progress-footer">
        <span className="daily-progress-percent">{percent}%</span>
        <span className="daily-progress-xp">+{progress.xp_earned} XP earned</span>
      </div>

    </div>
  );
}
