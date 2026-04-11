import { create } from "zustand";
import api from "../api/client";

const useAchievementStore = create((set, get) => ({
  achievements: [],
  achievementQueue: [],
  currentAchievement: null,
  loading: false,

  fetchAchievements: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/progress/achievements");
      set({ achievements: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  showAchievementPopup: (achievement) => {
    const { currentAchievement } = get();
    if (currentAchievement) {
      set((state) => ({ achievementQueue: [...state.achievementQueue, achievement] }));
    } else {
      set({ currentAchievement: achievement });
    }
  },

  dismissPopup: () => {
    const { achievementQueue } = get();
    if (achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      set({ currentAchievement: next, achievementQueue: rest });
    } else {
      set({ currentAchievement: null });
    }
  },
}));

export default useAchievementStore;
