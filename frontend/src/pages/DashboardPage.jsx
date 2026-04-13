import { useCallback, useEffect, useState } from "react";
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
import { Plus, Trophy, LogOut, Calendar, Sword, Wand2, Crosshair, Sparkles, Target } from "lucide-react";
import useToastStore from "../stores/toastStore";
import { DashboardSkeleton } from "../components/SkeletonLoaders";
import ConfettiExplosion from "../components/ConfettiExplosion";
import StreakDanger from "../components/StreakDanger";
import ComboIndicator from "../components/ComboIndicator";
import ClassRank from "../components/ClassRank";
import ModalShell from "../components/ModalShell";
import ConfirmDialog from "../components/ConfirmDialog";

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
  const [combo, setCombo] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [insightsHabitId, setInsightsHabitId] = useState(null);
  const [pendingDeleteHabit, setPendingDeleteHabit] = useState(null);

  const triggerCelebration = useCallback((nextLevel) => {
    setLevelUpLevel(nextLevel);
    setConfettiActive(true);
    window.setTimeout(() => setConfettiActive(false), 2500);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
    fetchHabits();
    fetchDailyProgress();
    fetchAchievements();
  }, [fetchAchievements, fetchDailyProgress, fetchHabits, fetchUser, navigate, token]);

  const handleComplete = async (habitId) => {
    try {
      const previousLevel = user?.level ?? 0;
      const result = await completeHabit(habitId);
      const updatedUser = await fetchUser();
      await fetchDailyProgress();

      setCombo(result.combo || 0);

      // Build rich toast message
      let msg = `+${result.xp_earned} XP`;
      if (result.is_critical) msg = `Critical hit: ${msg}`;
      if (result.combo > 1) msg += ` • ${result.combo}x combo`;
      if (result.streak_bonus) msg += ` • streak bonus +${result.streak_bonus}`;
      addToast(msg, result.is_critical ? "warning" : "success", result.is_critical ? 5000 : 3500);

      if (updatedUser?.level > previousLevel) {
        triggerCelebration(updatedUser.level);
      }

      // Perfect day confetti
      if (result.perfect_day) {
        setConfettiActive(true);
        window.setTimeout(() => setConfettiActive(false), 2500);
        addToast(`Perfect day • +${result.perfect_day_bonus} XP`, "success", 5000);
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
    await deleteHabit(habitId);
    await fetchDailyProgress();
    addToast("Quest deleted", "warning");
    setPendingDeleteHabit(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <button
            aria-label="Open profile"
            className="avatar-badge"
            onClick={() => navigate("/profile")}
            type="button"
          >
            <span className="avatar-icon">{(() => { const Icon = AVATARS[user.avatar] || Sword; return <Icon size={24} />; })()}</span>
            <div className="avatar-info">
              <span className="avatar-name">{user.username}</span>
              <ClassRank level={user.level} />
            </div>
          </button>
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
            aria-label="Open history"
            onClick={() => navigate("/history")}
            className="hud-btn"
            type="button"
          >
            <Calendar size={20} />
          </button>
          <button
            aria-label="View achievements"
            onClick={() => setShowAchievements(!showAchievements)}
            className="hud-btn"
            type="button"
          >
            <Trophy size={20} />
          </button>
          <button aria-label="Log out" onClick={handleLogout} className="hud-btn" type="button">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <section className="dashboard-overview">
          <StreakDanger streak={user.streak} completedToday={dailyProgress?.completed_habits || 0} />
          <div className="dashboard-sidebar">
            <DailyProgress progress={dailyProgress} />
            <StreakCounter streak={user.streak} />
            <ComboIndicator combo={combo} />
          </div>
        </section>

        {/* Quest List */}
        <section className="quest-section">
          <div className="quest-section-header">
            <div>
              <p className="quest-section-eyebrow">Today’s Workspace</p>
              <h2 className="quest-section-title">Active Quests</h2>
            </div>
            <div className="quest-section-actions">
              <button onClick={() => setShowAchievements(true)} className="secondary-btn" type="button">
                <Trophy size={16} />
                Achievements
              </button>
              <button onClick={() => setShowCreateModal(true)} className="add-quest-btn" type="button">
                <Plus size={18} />
                New Quest
              </button>
            </div>
          </div>

          <div className="quest-list">
            {habits.length === 0 ? (
              <div className="no-quests">
                <h3>No quests yet</h3>
                <p>Start with one small repeatable quest so the dashboard has something to track today.</p>
                <button className="primary-btn" onClick={() => setShowCreateModal(true)} type="button">
                  Create First Quest
                </button>
              </div>
            ) : (
              habits.map((habit) => (
                <QuestCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleComplete}
                  onDelete={(habitId) => setPendingDeleteHabit(habitId)}
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

      {showAchievements ? (
        <ModalShell
          className="achievements-dialog"
          closeLabel="Close achievements"
          description="Unlocked milestones and remaining goals."
          onClose={() => setShowAchievements(false)}
          title="Achievements"
        >
          <AchievementsPanel />
        </ModalShell>
      ) : null}

      {pendingDeleteHabit ? (
        <ConfirmDialog
          confirmLabel="Delete Quest"
          description="This will remove the quest from your dashboard and history tracking for future completions."
          isDestructive
          onCancel={() => setPendingDeleteHabit(null)}
          onConfirm={() => handleDelete(pendingDeleteHabit)}
          title="Delete this quest?"
        />
      ) : null}

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
