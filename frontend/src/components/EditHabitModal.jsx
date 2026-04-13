import { useId, useState } from "react";
import useHabitStore from "../stores/habitStore";
import ModalShell from "./ModalShell";
import { DIFFICULTIES, SKILLS } from "./habitOptions";

export default function EditHabitModal({ habit, onClose, onUpdated }) {
  const { updateHabit } = useHabitStore();
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [difficulty, setDifficulty] = useState(habit.difficulty);
  const [skill, setSkill] = useState(habit.skill);
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
      await updateHabit(habit.id, { title, description, difficulty, skill });
      onUpdated();
    } catch {
      setError("Failed to update quest");
    }
  };

  return (
    <ModalShell
      closeLabel="Close edit quest dialog"
      description="Update the title, description, difficulty, and focus area for this quest."
      onClose={onClose}
      title="Edit Quest"
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
              type="text"
              autoComplete="off"
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
              type="text"
              autoComplete="off"
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
            Save Changes
          </button>
      </form>
    </ModalShell>
  );
}
