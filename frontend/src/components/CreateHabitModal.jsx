import { useId, useState } from "react";
import useHabitStore from "../stores/habitStore";
import { Sword, Shield, Zap, Heart, Brain, Briefcase, Users, Palette } from "lucide-react";
import ModalShell from "./ModalShell";

const DIFFICULTIES = [
  { value: "easy", label: "Easy", xp: 10, icon: Shield, color: "#2cb67d" },
  { value: "medium", label: "Medium", xp: 25, icon: Zap, color: "#ffb84d" },
  { value: "hard", label: "Hard", xp: 50, icon: Sword, color: "#ff6b81" },
];

const SKILLS = [
  { value: "health", label: "Health", icon: Heart },
  { value: "mind", label: "Mind", icon: Brain },
  { value: "career", label: "Career", icon: Briefcase },
  { value: "social", label: "Social", icon: Users },
  { value: "creativity", label: "Creativity", icon: Palette },
];

export default function CreateHabitModal({ onClose, onCreated }) {
  const { createHabit } = useHabitStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [skill, setSkill] = useState("health");
  const [error, setError] = useState("");
  const titleId = useId();
  const descriptionId = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Quest title is required");
      return;
    }
    try {
      await createHabit({ title, description, difficulty, skill });
      onCreated();
    } catch {
      setError("Failed to create quest");
    }
  };

  return (
    <ModalShell
      closeLabel="Close new quest dialog"
      description="Add a new quest with a difficulty and focus area."
      onClose={onClose}
      title="Create Quest"
    >
      {error ? (
        <div className="modal-error" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor={titleId}>
              Quest Title
            </label>
            <input
              autoComplete="off"
              type="text"
              id={titleId}
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Morning Workout…"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={descriptionId}>
              Description
            </label>
            <input
              autoComplete="off"
              type="text"
              id={descriptionId}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex. 30 minutes of exercise…"
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
                    aria-pressed={difficulty === d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`difficulty-btn ${difficulty === d.value ? "selected" : ""}`}
                  >
                    <Icon size={18} style={{ color: d.color }} />
                    <span style={{ color: d.color }}>{d.label}</span>
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
                    aria-pressed={skill === s.value}
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
            Create Quest
          </button>
      </form>
    </ModalShell>
  );
}
