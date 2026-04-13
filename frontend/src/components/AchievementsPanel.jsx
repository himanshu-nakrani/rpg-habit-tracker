import { useEffect } from "react";
import useAchievementStore from "../stores/achievementStore";
import { Trophy, Lock } from "lucide-react";

export default function AchievementsPanel({ compact = false }) {
  const { achievements, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h3 className="achievements-title">
          <Trophy size={16} />
          Achievements
        </h3>
        <span className="achievements-count">
          {unlocked.length}/{achievements.length}
        </span>
      </div>

      <div className="achievements-list">
        {unlocked.map((a) => (
          <div key={a.id} className="achievement-item unlocked">
            <span className="achievement-icon">{a.icon}</span>
            <div className="achievement-info">
              <span className="achievement-name">{a.name}</span>
              <span className="achievement-desc">{a.description}</span>
            </div>
          </div>
        ))}
        {!compact && locked.length === 0 ? (
          <div className="achievement-empty">All current achievements unlocked.</div>
        ) : null}
        {locked.map((a) => (
          <div key={a.id} className="achievement-item locked">
            <span className="achievement-icon"><Lock size={18} /></span>
            <div className="achievement-info">
              <span className="achievement-name">{a.name}</span>
              <span className="achievement-desc">{a.description}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
