import { useEffect, useState } from "react";

export default function XPBar({ xp, xpForNextLevel, level, xpProgress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(xpProgress * 100), 100);
    return () => clearTimeout(timer);
  }, [xpProgress]);

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <div>
          <p className="xp-bar-label">Level Progress</p>
          <div className="xp-bar-meta">
            <span className="level-badge">Lv {level}</span>
            <span className="xp-bar-copy">
              {xp} / {xpForNextLevel} XP
            </span>
          </div>
        </div>
        <span className="xp-bar-percent">{Math.round(xpProgress * 100)}%</span>
      </div>
      <div
        aria-label="Experience progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(animatedProgress)}
        className="xp-bar-track"
        role="progressbar"
      >
        <div
          className="xp-bar-fill"
          style={{ width: `${animatedProgress}%` }}
        >
          <div className="xp-bar-shimmer" />
        </div>
      </div>
    </div>
  );
}
