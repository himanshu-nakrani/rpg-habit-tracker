import { Trophy, X } from "lucide-react";

export default function AchievementPopup({ achievement, onDismiss }) {
  if (!achievement) return null;

  return (
    <div className="achievement-overlay" onClick={onDismiss}>
      <div className="achievement-popup" onClick={(e) => e.stopPropagation()}>
        <button className="achievement-close" onClick={onDismiss}>
          <X size={18} />
        </button>
        <div className="achievement-glow" />
        <div className="achievement-icon">{achievement.icon}</div>
        <h3 className="achievement-title">Achievement Unlocked!</h3>
        <p className="achievement-name">{achievement.name}</p>
        <p className="achievement-desc">{achievement.description}</p>
        <div className="achievement-badge">
          <Trophy size={16} />
          <span>Earned</span>
        </div>
      </div>

      <style>{`
        .achievement-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .achievement-popup {
          position: relative;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          border: 2px solid #818cf8;
          border-radius: 16px;
          padding: 32px 40px;
          text-align: center;
          animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          overflow: hidden;
          max-width: 360px;
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .achievement-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(129,140,248,0.2), transparent 60%);
          animation: glow-rotate 3s linear infinite;
        }
        @keyframes glow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .achievement-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: #6366f1;
          cursor: pointer;
          z-index: 1;
        }
        .achievement-icon {
          font-size: 3rem;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
          animation: icon-bounce 0.6s ease;
        }
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .achievement-title {
          font-size: 0.75rem;
          color: #818cf8;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }
        .achievement-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: #e0e7ff;
          margin: 4px 0;
          position: relative;
          z-index: 1;
        }
        .achievement-desc {
          font-size: 0.85rem;
          color: #a5b4fc;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .achievement-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(129,140,248,0.2);
          border: 1px solid #6366f1;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 0.75rem;
          color: #c7d2fe;
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
