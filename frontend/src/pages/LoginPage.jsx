import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { Sword, Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const { login, register, loading, error, clearError, token } = useAuthStore();
  const navigate = useNavigate();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      if (isRegister) {
        await register(username, email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch {
      // Store handles field-level error state for the form shell.
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-logo">
            <Sword size={32} />
          </div>
          <div className="login-header">
            <p className="login-kicker">Daily Progress, Framed Like a Campaign</p>
            <h1 className="login-title">RPG Habit Tracker</h1>
            <p className="login-subtitle">
              Build streaks, track momentum, and turn routine work into a progression loop that
              stays motivating.
            </p>
          </div>
          <ul className="login-feature-list" aria-label="Key product highlights">
            <li>Track quests across health, mind, work, social, and creativity.</li>
            <li>See daily progress, streak pressure, and long-term history in one workspace.</li>
            <li>Celebrate wins with XP, rank progress, and achievement milestones.</li>
          </ul>
        </div>

        <div className="login-panel">
          <div className="login-panel-header">
            <h2 className="login-panel-title">{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="login-panel-copy">
              {isRegister ? "Set up a profile and start your first campaign." : "Sign in to pick up today’s quests."}
            </p>
          </div>

          {error ? (
            <div className="login-error" role="alert">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister ? (
              <div className="field-group">
                <label className="field-label" htmlFor={usernameId}>
                  Character Name
                </label>
                <div className="input-group">
                  <User aria-hidden="true" size={18} className="input-icon" />
                  <input
                    autoComplete="username"
                    className="login-input"
                    id={usernameId}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex. Morning Ranger"
                    required
                    type="text"
                    value={username}
                  />
                </div>
              </div>
            ) : null}

            <div className="field-group">
              <label className="field-label" htmlFor={emailId}>
                Email
              </label>
              <div className="input-group">
                <Mail aria-hidden="true" size={18} className="input-icon" />
                <input
                  autoComplete="email"
                  className="login-input"
                  id={emailId}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex. party@tracker.app"
                  required
                  spellCheck={false}
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor={passwordId}>
                Password
              </label>
              <div className="input-group">
                <Lock aria-hidden="true" size={18} className="input-icon" />
                <input
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="login-input"
                  id={passwordId}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password…"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Loading…" : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="login-switch">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <button
              className="login-switch-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                clearError();
              }}
              type="button"
            >
              {isRegister ? "Sign In" : "Create One"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
