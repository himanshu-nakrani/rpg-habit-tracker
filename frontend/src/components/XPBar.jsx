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
      <style>{`
        .xp-bar-container {
          width: 100%;
        }
        .level-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1a1a2e;
          font-weight: 900;
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          letter-spacing: 1px;
          border: 1px solid #fbbf24;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
        }
        .xp-bar-track {
          width: 100%;
          height: 20px;
          background: #1a1a2e;
          border-radius: 10px;
          border: 2px solid #4a3728;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .xp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #b45309, #f59e0b, #fbbf24);
          border-radius: 8px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
        }
        .xp-bar-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
