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

    </div>
  );
}
