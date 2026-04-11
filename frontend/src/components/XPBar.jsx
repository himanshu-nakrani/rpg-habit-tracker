import { useEffect, useState } from "react";

export default function XPBar({ xp, xpForNextLevel, level, xpProgress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(xpProgress * 100), 100);
    return () => clearTimeout(timer);
  }, [xpProgress]);

  return (
    <div className="xp-bar-container">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="level-badge">LV.{level}</span>
          <span className="text-amber-400 font-bold text-sm tracking-wide">
            {xp} / {xpForNextLevel} XP
          </span>
        </div>
      </div>
      <div className="xp-bar-track">
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
