import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

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
    } catch {}
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Sword size={40} />
          </div>
          <h1 className="login-title">RPG Habit Tracker</h1>
          <p className="login-subtitle">
            {isRegister ? "Begin Your Quest" : "Continue Your Journey"}
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Character Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
              />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Loading..." : isRegister ? "Create Character" : "Enter Realm"}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? "Already have a character?" : "New adventurer?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); clearError(); }}
            className="login-switch-btn"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>

    </div>
  );
}
