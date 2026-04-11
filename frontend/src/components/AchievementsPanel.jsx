import { useEffect } from "react";
import useAchievementStore from "../stores/achievementStore";
import { Trophy } from "lucide-react";

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
            <span className="achievement-icon">🔒</span>
            <div className="achievement-info">
              <span className="achievement-name">{a.name}</span>
              <span className="achievement-desc">{a.description}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .achievements-panel {
          background: linear-gradient(135deg, #0c0a1a, #1a1033);
          border: 1px solid #2d2250;
          border-radius: 12px;
          padding: 16px;
        }
        .achievements-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin: 0 0 12px;
        }
        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        .achievement-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .achievement-item.unlocked {
          background: rgba(139,92,246,0.08);
          border: 1px solid rgba(139,92,246,0.2);
        }
        .achievement-item.locked {
          background: rgba(0,0,0,0.2);
          border: 1px solid transparent;
          opacity: 0.5;
        }
        .achievement-icon {
          font-size: 1.3rem;
          width: 32px;
          text-align: center;
        }
        .achievement-info {
          display: flex;
          flex-direction: column;
        }
        .achievement-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .achievement-desc {
          font-size: 0.65rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
