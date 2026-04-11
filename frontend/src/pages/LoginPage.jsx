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

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
          padding: 20px;
        }
        .login-card {
          background: linear-gradient(135deg, #0f0e1a, #1a1033);
          border: 1px solid #2d2250;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1);
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-logo {
          color: #8b5cf6;
          margin-bottom: 12px;
          filter: drop-shadow(0 0 12px rgba(139,92,246,0.5));
          animation: sword-float 3s ease-in-out infinite;
        }
        @keyframes sword-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        .login-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #e2e8f0;
          letter-spacing: 2px;
          margin: 0;
        }
        .login-subtitle {
          color: #8b5cf6;
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .login-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 16px;
          text-align: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: #6366f1;
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          background: #0a0a1a;
          border: 1px solid #2d2250;
          border-radius: 10px;
          color: #e2e8f0;
          font-size: 0.9rem;
          transition: border-color 0.2s;
          outline: none;
        }
        .login-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 12px rgba(139,92,246,0.2);
        }
        .login-input::placeholder {
          color: #475569;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 8px;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-switch {
          text-align: center;
          margin-top: 24px;
          color: #64748b;
          font-size: 0.85rem;
        }
        .login-switch-btn {
          background: none;
          border: none;
          color: #a78bfa;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .login-switch-btn:hover {
          color: #c4b5fd;
        }
      `}</style>
    </div>
  );
}
