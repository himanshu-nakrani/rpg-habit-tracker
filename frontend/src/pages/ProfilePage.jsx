import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import api from "../api/client";
import { ArrowLeft, Check, User, Sword, Wand2, Crosshair, Sparkles, Target } from "lucide-react";

const AVATARS = [
  { value: "warrior", label: "Warrior", icon: Sword },
  { value: "mage", label: "Mage", icon: Wand2 },
  { value: "rogue", label: "Rogue", icon: Crosshair },
  { value: "healer", label: "Healer", icon: Sparkles },
  { value: "ranger", label: "Ranger", icon: Target },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, fetchUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/auth/me", { username, avatar });
      await fetchUser();
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="profile-back" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          Back to Quests
        </button>

        <div className="profile-header">
          <div className="profile-avatar-large">
            {(() => { const Icon = AVATARS.find((a) => a.value === avatar)?.icon || Sword; return <Icon size={48} />; })()}
          </div>
          <h1 className="profile-title">Character Profile</h1>
          <div className="profile-stats">
            <span className="profile-stat">Level {user.level}</span>
            <span className="profile-stat-sep">•</span>
            <span className="profile-stat">{user.xp} XP</span>
            <span className="profile-stat-sep">•</span>
            <span className="profile-stat">{user.streak} Day Streak</span>
          </div>
        </div>

        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="profile-section">
          <label className="profile-label">Character Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="profile-section">
          <label className="profile-label">Avatar</label>
          <div className="avatar-grid">
            {AVATARS.map((a) => {
              const AvatarIcon = a.icon;
              return (
              <button
                key={a.value}
                onClick={() => setAvatar(a.value)}
                className={`avatar-option ${avatar === a.value ? "avatar-selected" : ""}`}
              >
                <span className="avatar-option-icon"><AvatarIcon size={28} /></span>
                <span className="avatar-option-label">{a.label}</span>
                {avatar === a.value && (
                  <div className="avatar-check">
                    <Check size={14} />
                  </div>
                )}
              </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="profile-save-btn"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
