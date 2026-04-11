import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import useHabitStore from "../stores/habitStore";
import useAchievementStore from "../stores/achievementStore";
import api from "../api/client";
import XPBar from "../components/XPBar";
import StreakCounter from "../components/StreakCounter";
import QuestCard from "../components/QuestCard";
import DailyProgress from "../components/DailyProgress";
import AchievementPopup from "../components/AchievementPopup";
import LevelUpAnimation from "../components/LevelUpAnimation";
import CreateHabitModal from "../components/CreateHabitModal";
import AchievementsPanel from "../components/AchievementsPanel";
import { Plus, Trophy, LogOut, User } from "lucide-react";

const AVATARS = {
  warrior: "⚔️",
  mage: "🧙",
  rogue: "🗡️",
  healer: "✨",
  ranger: "🏹",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, fetchUser, logout } = useAuthStore();
  const { habits, fetchHabits, completeHabit, deleteHabit, fetchDailyProgress, dailyProgress } =
    useHabitStore();
  const { achievements, newAchievement, fetchAchievements, showAchievementPopup, dismissPopup } =
    useAchievementStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [prevLevel, setPrevLevel] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
    fetchHabits();
    fetchDailyProgress();
    fetchAchievements();
  }, [token]);

  useEffect(() => {
    if (user && prevLevel !== null && user.level > prevLevel) {
      setLevelUpLevel(user.level);
    }
    if (user) setPrevLevel(user.level);
  }, [user?.level]);

  const handleComplete = async (habitId) => {
    try {
      const result = await completeHabit(habitId);
      await fetchUser();
      await fetchDailyProgress();

      const achRes = await api.get("/progress/achievements");
      const newlyUnlocked = achRes.data.filter(
        (a) => a.unlocked && !achievements.find((oa) => oa.id === a.id && oa.unlocked)
      );
      newlyUnlocked.forEach((a) => showAchievementPopup(a));
      await fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Abandon this quest? This cannot be undone.")) {
      await deleteHabit(habitId);
      await fetchDailyProgress();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <style>{`
          .loading-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a1a; }
          .loading-spinner { width: 40px; height: 40px; border: 3px solid #2d2250; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <LevelUpAnimation
        level={levelUpLevel}
        show={levelUpLevel !== null}
        onComplete={() => setLevelUpLevel(null)}
      />
      <AchievementPopup achievement={newAchievement} onDismiss={dismissPopup} />

      {/* Top HUD Bar */}
      <header className="hud-bar">
        <div className="hud-left">
          <div className="avatar-badge">
            <span className="avatar-icon">{AVATARS[user.avatar] || "⚔️"}</span>
            <span className="avatar-name">{user.username}</span>
          </div>
        </div>
        <div className="hud-center">
          <XPBar
            xp={user.xp}
            xpForNextLevel={user.xp_for_next_level}
            level={user.level}
            xpProgress={user.xp_progress}
          />
        </div>
        <div className="hud-right">
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="hud-btn"
            title="Achievements"
          >
            <Trophy size={20} />
          </button>
          <button onClick={handleLogout} className="hud-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Sidebar Stats */}
        <aside className="dashboard-sidebar">
          <StreakCounter streak={user.streak} />
          <DailyProgress progress={dailyProgress} />
          {showAchievements && <AchievementsPanel />}
        </aside>

        {/* Quest List */}
        <section className="quest-section">
          <div className="quest-section-header">
            <h2 className="quest-section-title">Active Quests</h2>
            <button onClick={() => setShowCreateModal(true)} className="add-quest-btn">
              <Plus size={18} />
              New Quest
            </button>
          </div>

          <div className="quest-list">
            {habits.length === 0 ? (
              <div className="no-quests">
                <p>No quests yet. Create your first quest to begin your adventure!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <QuestCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchHabits();
            fetchDailyProgress();
          }}
        />
      )}

      <style>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a1a 0%, #0f0e1a 50%, #0a0a1a 100%);
          color: #e2e8f0;
        }

        /* HUD Bar */
        .hud-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          background: linear-gradient(180deg, #1a1033, #0f0e1a);
          border-bottom: 1px solid #2d2250;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .hud-left { flex: 0 0 auto; }
        .hud-center { flex: 1; max-width: 600px; }
        .hud-right { flex: 0 0 auto; display: flex; gap: 8px; }
        .avatar-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(139,92,246,0.1);
          border: 1px solid #2d2250;
          border-radius: 10px;
          padding: 6px 14px;
        }
        .avatar-icon { font-size: 1.5rem; }
        .avatar-name {
          font-weight: 700;
          color: #c4b5fd;
          font-size: 0.9rem;
        }
        .hud-btn {
          background: rgba(139,92,246,0.1);
          border: 1px solid #2d2250;
          border-radius: 8px;
          color: #8b5cf6;
          cursor: pointer;
          padding: 8px;
          transition: all 0.2s;
        }
        .hud-btn:hover {
          background: rgba(139,92,246,0.2);
          border-color: #8b5cf6;
        }

        /* Main Layout */
        .dashboard-main {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        @media (max-width: 768px) {
          .dashboard-main {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar */
        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Quest Section */
        .quest-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .quest-section-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #e2e8f0;
          letter-spacing: 1px;
        }
        .add-quest-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-quest-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        }
        .quest-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .no-quests {
          text-align: center;
          padding: 48px 24px;
          color: #64748b;
          background: #0f0e1a;
          border: 1px dashed #2d2250;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
