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
import EditHabitModal from "../components/EditHabitModal";
import AchievementsPanel from "../components/AchievementsPanel";
import QuestInsightsModal from "../components/QuestInsightsModal";
import { Plus, Trophy, LogOut, User, Calendar, Sword, Wand2, Crosshair, Sparkles, Target } from "lucide-react";
import useToastStore from "../stores/toastStore";
import { DashboardSkeleton } from "../components/SkeletonLoaders";
import ConfettiExplosion from "../components/ConfettiExplosion";
import StreakDanger from "../components/StreakDanger";
import ComboIndicator from "../components/ComboIndicator";
import ClassRank from "../components/ClassRank";

const BATTLE_CRIES = [
  "Legendary move!", "The enemy trembles!", "Unstoppable force!",
  "Critical strike!", "You're on fire!", "Power overwhelming!",
  "A true warrior!", "Flawless execution!", "The gods approve!",
  "Quest dominated!", "Heroic effort!", "Beyond mortal limits!",
  "History in the making!", "The crowd goes wild!",
];
const randomCry = () => BATTLE_CRIES[Math.floor(Math.random() * BATTLE_CRIES.length)];

const AVATARS = {
  warrior: Sword,
  mage: Wand2,
  rogue: Crosshair,
  healer: Sparkles,
  ranger: Target,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, fetchUser, logout } = useAuthStore();
  const { habits, fetchHabits, completeHabit, uncompleteHabit, deleteHabit, fetchDailyProgress, dailyProgress } =
    useHabitStore();
  const { currentAchievement, fetchAchievements, showAchievementPopup, dismissPopup } =
    useAchievementStore();
  const addToast = useToastStore((s) => s.addToast);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [prevLevel, setPrevLevel] = useState(null);
  const [combo, setCombo] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [insightsHabitId, setInsightsHabitId] = useState(null);

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
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2500);
    }
    if (user) setPrevLevel(user.level);
  }, [user?.level]);

  const handleComplete = async (habitId) => {
    try {
      const result = await completeHabit(habitId);
      await fetchUser();
      await fetchDailyProgress();

      setCombo(result.combo || 0);

      // Build rich toast message
      let msg = `+${result.xp_earned} XP`;
      if (result.is_critical) msg = `CRITICAL HIT! ${msg}`;
      if (result.combo > 1) msg += ` (${result.combo}x combo)`;
      if (result.streak_bonus) msg += ` +${result.streak_bonus} streak milestone!`;
      msg += ` ${randomCry()}`;
      addToast(msg, result.is_critical ? "warning" : "success", result.is_critical ? 5000 : 3500);

      // Perfect day confetti
      if (result.perfect_day) {
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 2500);
        addToast(`PERFECT DAY! +${result.perfect_day_bonus} bonus XP! All quests complete!`, "success", 5000);
      }

      const achRes = await api.get("/progress/achievements");
      const currentAchievements = useAchievementStore.getState().achievements;
      const newlyUnlocked = achRes.data.filter(
        (a) => a.unlocked && !currentAchievements.find((oa) => oa.id === a.id && oa.unlocked)
      );
      newlyUnlocked.forEach((a) => showAchievementPopup(a));
      await fetchAchievements();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to complete quest", "error");
    }
  };

  const handleUndo = async (habitId) => {
    try {
      const result = await uncompleteHabit(habitId);
      await fetchUser();
      await fetchDailyProgress();
      addToast(`Completion undone (-${result.xp_removed} XP)`, "info");
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to undo", "error");
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Abandon this quest? This cannot be undone.")) {
      await deleteHabit(habitId);
      await fetchDailyProgress();
      addToast("Quest abandoned", "warning");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard">
      <ConfettiExplosion active={confettiActive} />
      <LevelUpAnimation
        level={levelUpLevel}
        show={levelUpLevel !== null}
        onComplete={() => setLevelUpLevel(null)}
      />
      <AchievementPopup achievement={currentAchievement} onDismiss={dismissPopup} />

      {/* Top HUD Bar */}
      <header className="hud-bar">
        <div className="hud-left">
          <div
            className="avatar-badge"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
            title="Edit Profile"
          >
            <span className="avatar-icon">{(() => { const Icon = AVATARS[user.avatar] || Sword; return <Icon size={24} />; })()}</span>
            <div className="avatar-info">
              <span className="avatar-name">{user.username}</span>
              <ClassRank level={user.level} />
            </div>
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
            onClick={() => navigate("/history")}
            className="hud-btn"
            title="Quest History"
          >
            <Calendar size={20} />
          </button>
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
          <StreakDanger streak={user.streak} completedToday={dailyProgress?.completed_habits || 0} />
          <StreakCounter streak={user.streak} />
          <ComboIndicator combo={combo} />
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
                  onEdit={(h) => setEditingHabit(h)}
                  onUndo={handleUndo}
                  onInsights={(id) => setInsightsHabitId(id)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {insightsHabitId && (
        <QuestInsightsModal
          habitId={insightsHabitId}
          onClose={() => setInsightsHabitId(null)}
        />
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onUpdated={() => {
            setEditingHabit(null);
            fetchHabits();
          }}
        />
      )}

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

    </div>
  );
}
