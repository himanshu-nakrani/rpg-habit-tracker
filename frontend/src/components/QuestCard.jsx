import { useState } from "react";
import { Sword, Shield, Zap, CheckCircle2, Circle, Star, Trash2, Pencil, BarChart3, Heart, Brain, Briefcase, Users, Palette } from "lucide-react";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", xp: 10, color: "text-green-400", border: "border-green-800", bg: "from-green-950/50", icon: Shield },
  medium: { label: "Medium", xp: 25, color: "text-amber-400", border: "border-amber-800", bg: "from-amber-950/50", icon: Zap },
  hard: { label: "Hard", xp: 50, color: "text-red-400", border: "border-red-800", bg: "from-red-950/50", icon: Sword },
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
  };

  return (
    <div className={`quest-card ${isCompleted ? "quest-completed" : ""} ${justCompleted ? "quest-burst" : ""} ${config.border}`}>
      <div className={`quest-bg ${config.bg}`} />
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
              onClick={handleCompleteClick}
              className={`quest-complete-btn ${isCompleted ? "quest-done" : ""} ${justCompleted ? "quest-check-pop" : ""}`}
              title={isCompleted ? "Undo completion" : "Complete quest"}
            >
              {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
            {showXpFloat && (
              <span className="xp-float">+{config.xp} XP</span>
            )}
            <button
              onClick={() => onInsights(habit.id)}
              className="quest-insights-btn"
              title="Quest insights"
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => onEdit(habit)}
              className="quest-edit-btn"
              title="Edit quest"
            >
              <Pencil size={16} />
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

    </div>
  );
}
