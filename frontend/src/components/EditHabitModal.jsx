import { useState } from "react";
import useHabitStore from "../stores/habitStore";
import { X, Sword, Shield, Zap, Heart, Brain, Briefcase, Users, Palette } from "lucide-react";

const DIFFICULTIES = [
  { value: "easy", label: "Easy", xp: 10, icon: Shield, color: "text-green-400", border: "border-green-600" },
  { value: "medium", label: "Medium", xp: 25, icon: Zap, color: "text-amber-400", border: "border-amber-600" },
  { value: "hard", label: "Hard", xp: 50, icon: Sword, color: "text-red-400", border: "border-red-600" },
];

const SKILLS = [
  { value: "health", label: "Health", icon: Heart },
  { value: "mind", label: "Mind", icon: Brain },
  { value: "career", label: "Career", icon: Briefcase },
  { value: "social", label: "Social", icon: Users },
  { value: "creativity", label: "Creativity", icon: Palette },
];

export default function EditHabitModal({ habit, onClose, onUpdated }) {
  const { updateHabit } = useHabitStore();
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [difficulty, setDifficulty] = useState(habit.difficulty);
  const [skill, setSkill] = useState(habit.skill);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Quest title is required");
      return;
    }
    try {
      await updateHabit(habit.id, { title, description, difficulty, skill });
      onUpdated();
    } catch {
      setError("Failed to update quest");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="modal-title">Edit Quest</h2>
        <p className="modal-subtitle">Modify your quest details</p>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Quest Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Workout"
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 30 minutes of exercise"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <div className="difficulty-options">
              {DIFFICULTIES.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    className={`difficulty-btn ${difficulty === d.value ? `selected ${d.border}` : ""}`}
                  >
                    <Icon size={18} className={d.color} />
                    <span className={d.color}>{d.label}</span>
                    <span className="text-xs text-gray-500">+{d.xp} XP</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skill Category</label>
            <div className="skill-options">
              {SKILLS.map((s) => {
                const SkillIcon = s.icon;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSkill(s.value)}
                    className={`skill-btn ${skill === s.value ? "selected" : ""}`}
                  >
                    <SkillIcon size={16} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>

    </div>
  );
}
