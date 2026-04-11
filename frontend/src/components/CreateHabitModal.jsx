import { useState } from "react";
import useHabitStore from "../stores/habitStore";
import { X, Sword, Shield, Zap } from "lucide-react";

const DIFFICULTIES = [
  { value: "easy", label: "Easy", xp: 10, icon: Shield, color: "text-green-400", border: "border-green-600" },
  { value: "medium", label: "Medium", xp: 25, icon: Zap, color: "text-amber-400", border: "border-amber-600" },
  { value: "hard", label: "Hard", xp: 50, icon: Sword, color: "text-red-400", border: "border-red-600" },
];

const SKILLS = [
  { value: "health", label: "Health", icon: "❤️" },
  { value: "mind", label: "Mind", icon: "🧠" },
  { value: "career", label: "Career", icon: "💼" },
  { value: "social", label: "Social", icon: "🤝" },
  { value: "creativity", label: "Creativity", icon: "🎨" },
];

export default function CreateHabitModal({ onClose, onCreated }) {
  const { createHabit } = useHabitStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [skill, setSkill] = useState("health");
  const [error, setError] = useState("");

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="modal-title">New Quest</h2>
        <p className="modal-subtitle">Define a new challenge for your adventurer</p>

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
              {SKILLS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSkill(s.value)}
                  className={`skill-btn ${skill === s.value ? "selected" : ""}`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Quest
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          padding: 20px;
        }
        .modal-card {
          background: linear-gradient(135deg, #0f0e1a, #1a1033);
          border: 1px solid #2d2250;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
        }
        .modal-close:hover { color: #e2e8f0; }
        .modal-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #e2e8f0;
          margin: 0;
        }
        .modal-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          margin: 4px 0 20px;
        }
        .modal-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          margin-bottom: 16px;
          text-align: center;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {}
        .form-label {
          display: block;
          font-size: 0.8rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          background: #0a0a1a;
          border: 1px solid #2d2250;
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #8b5cf6;
        }
        .form-input::placeholder { color: #475569; }
        .difficulty-options {
          display: flex;
          gap: 8px;
        }
        .difficulty-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: #0a0a1a;
          border: 1px solid #2d2250;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .difficulty-btn.selected {
          background: rgba(139,92,246,0.1);
        }
        .difficulty-btn:hover {
          border-color: #4338ca;
        }
        .skill-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .skill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #0a0a1a;
          border: 1px solid #2d2250;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .skill-btn.selected {
          background: rgba(139,92,246,0.1);
          border-color: #8b5cf6;
          color: #e2e8f0;
        }
        .skill-btn:hover { border-color: #4338ca; }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 8px;
        }
        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        }
      `}</style>
    </div>
  );
}
