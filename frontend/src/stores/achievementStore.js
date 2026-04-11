import { create } from "zustand";
import api from "../api/client";

const useAchievementStore = create((set) => ({
  achievements: [],
  newAchievement: null,
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
    set({ newAchievement: achievement });
    setTimeout(() => set({ newAchievement: null }), 4000);
  },

  dismissPopup: () => set({ newAchievement: null }),
}));

export default useAchievementStore;
