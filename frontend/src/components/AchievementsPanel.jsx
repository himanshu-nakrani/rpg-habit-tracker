import { useEffect } from "react";
import useAchievementStore from "../stores/achievementStore";
import { Trophy, Lock } from "lucide-react";

export default function AchievementsPanel() {
  const { achievements, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="achievements-panel">
      <h3 className="achievements-title">
        <Trophy size={16} />
        Achievements ({unlocked.length}/{achievements.length})
      </h3>

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
