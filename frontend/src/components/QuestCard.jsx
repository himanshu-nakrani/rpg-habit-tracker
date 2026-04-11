import { Sword, Shield, Zap, CheckCircle2, Circle, Star, Trash2 } from "lucide-react";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", xp: 10, color: "text-green-400", border: "border-green-800", bg: "from-green-950/50", icon: Shield },
  medium: { label: "Medium", xp: 25, color: "text-amber-400", border: "border-amber-800", bg: "from-amber-950/50", icon: Zap },
  hard: { label: "Hard", xp: 50, color: "text-red-400", border: "border-red-800", bg: "from-red-950/50", icon: Sword },
};

const SKILL_ICONS = {
  health: "❤️",
  mind: "🧠",
  career: "💼",
  social: "🤝",
  creativity: "🎨",
};

export default function QuestCard({ habit, onComplete, onDelete }) {
  const config = DIFFICULTY_CONFIG[habit.difficulty] || DIFFICULTY_CONFIG.easy;
  const DiffIcon = config.icon;
  const isCompleted = habit.completed_today;

  return (
    <div className={`quest-card ${isCompleted ? "quest-completed" : ""} ${config.border}`}>
      <div className={`quest-bg ${config.bg}`} />
      <div className="quest-content">
        <div className="quest-header">
          <div className="quest-skill">{SKILL_ICONS[habit.skill] || "⚔️"}</div>
          <div className="quest-info">
            <h3 className={`quest-title ${isCompleted ? "line-through opacity-60" : ""}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="quest-desc">{habit.description}</p>
            )}
          </div>
        </div>

        <div className="quest-footer">
          <div className="quest-meta">
            <span className={`quest-difficulty ${config.color}`}>
              <DiffIcon size={14} />
              {config.label}
            </span>
            <span className="quest-xp">
              <Star size={14} className="text-amber-400" />
              +{config.xp} XP
            </span>
          </div>

          <div className="quest-actions">
            <button
              onClick={() => !isCompleted && onComplete(habit.id)}
              disabled={isCompleted}
              className={`quest-complete-btn ${isCompleted ? "quest-done" : ""}`}
              title={isCompleted ? "Already completed today" : "Complete quest"}
            >
              {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="quest-delete-btn"
              title="Abandon quest"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .quest-card {
          position: relative;
          border-radius: 12px;
          border: 1px solid;
          overflow: hidden;
          transition: all 0.3s ease;
          background: #0f0e1a;
        }
        .quest-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .quest-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--tw-gradient-from), transparent);
          opacity: 0.3;
        }
        .quest-completed {
          opacity: 0.7;
        }
        .quest-content {
          position: relative;
          padding: 16px;
          z-index: 1;
        }
        .quest-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .quest-skill {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        .quest-title {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0;
        }
        .quest-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .quest-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .quest-meta {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .quest-difficulty {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .quest-xp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #fbbf24;
          font-weight: 700;
        }
        .quest-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .quest-complete-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          padding: 4px;
        }
        .quest-complete-btn:hover:not(.quest-done) {
          color: #22c55e;
          transform: scale(1.2);
        }
        .quest-done {
          color: #22c55e !important;
          cursor: default;
        }
        .quest-delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
          padding: 4px;
        }
        .quest-delete-btn:hover {
          color: #ef4444;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
