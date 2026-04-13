import { useState } from "react";
import { Sword, Shield, Zap, CheckCircle2, Circle, Star, Trash2, Pencil, BarChart3, Heart, Brain, Briefcase, Users, Palette, MoreHorizontal } from "lucide-react";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", xp: 10, tone: "#2cb67d", icon: Shield },
  medium: { label: "Medium", xp: 25, tone: "#ffb84d", icon: Zap },
  hard: { label: "Hard", xp: 50, tone: "#ff6b81", icon: Sword },
};

const SKILL_ICONS = {
  health: Heart,
  mind: Brain,
  career: Briefcase,
  social: Users,
  creativity: Palette,
};

export default function QuestCard({ habit, onComplete, onDelete, onEdit, onUndo, onInsights }) {
  const config = DIFFICULTY_CONFIG[habit.difficulty] || DIFFICULTY_CONFIG.easy;
  const DiffIcon = config.icon;
  const isCompleted = habit.completed_today;
  const [justCompleted, setJustCompleted] = useState(false);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCompleteClick = async () => {
    if (isCompleted) {
      onUndo(habit.id);
      return;
    }
    setJustCompleted(true);
    setShowXpFloat(true);
    onComplete(habit.id);
    setTimeout(() => setJustCompleted(false), 600);
    setTimeout(() => setShowXpFloat(false), 1200);
    setMenuOpen(false);
  };

  return (
    <div className={`quest-card ${isCompleted ? "quest-completed" : ""} ${justCompleted ? "quest-burst" : ""}`}>
      <div className="quest-bg" style={{ background: `linear-gradient(90deg, ${config.tone}22, transparent)` }} />
      <div className="quest-content">
        <div className="quest-header">
          <div className="quest-skill">{(() => { const Icon = SKILL_ICONS[habit.skill] || Sword; return <Icon size={20} />; })()}</div>
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
            <span className="quest-difficulty" style={{ color: config.tone }}>
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
              aria-label={isCompleted ? `Undo ${habit.title}` : `Complete ${habit.title}`}
              onClick={handleCompleteClick}
              className={`quest-complete-btn ${isCompleted ? "quest-done" : ""} ${justCompleted ? "quest-check-pop" : ""}`}
              type="button"
            >
              {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
            {showXpFloat && (
              <span className="xp-float">+{config.xp} XP</span>
            )}
            <div className="quest-menu-wrap">
              <button
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label={`Open actions for ${habit.title}`}
                className="quest-menu-btn"
                onClick={() => setMenuOpen((open) => !open)}
                type="button"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen ? (
                <div className="quest-menu" role="menu">
                  <button
                    className="quest-menu-item"
                    onClick={() => {
                      onInsights(habit.id);
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <BarChart3 size={16} />
                    Insights
                  </button>
                  <button
                    className="quest-menu-item"
                    onClick={() => {
                      onEdit(habit);
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    className="quest-menu-item danger"
                    onClick={() => {
                      onDelete(habit.id);
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
