import { Trophy } from "lucide-react";
import ModalShell from "./ModalShell";

export default function AchievementPopup({ achievement, onDismiss }) {
  if (!achievement) return null;

  return (
    <ModalShell
      className="achievement-popup"
      closeLabel="Close achievement details"
      description={achievement.description}
      onClose={onDismiss}
      title="Achievement Unlocked"
    >
        <div className="achievement-glow" />
        <div className="achievement-icon">{achievement.icon}</div>
        <p className="achievement-name">{achievement.name}</p>
        <p className="achievement-desc">{achievement.description}</p>
        <div className="achievement-badge">
          <Trophy size={16} />
          <span>Earned</span>
        </div>
    </ModalShell>
  );
}
