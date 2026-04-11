import { create } from "zustand";
import api from "../api/client";

const useHabitStore = create((set, get) => ({
  habits: [],
  dailyProgress: null,
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/habits/");
      set({ habits: res.data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch habits", loading: false });
    }
  },

  createHabit: async (habitData) => {
    try {
      const res = await api.post("/habits/", habitData);
      set((state) => ({ habits: [...state.habits, res.data] }));
      return res.data;
    } catch (err) {
      set({ error: "Failed to create habit" });
      throw err;
    }
  },

  updateHabit: async (habitId, habitData) => {
    try {
      const res = await api.put(`/habits/${habitId}`, habitData);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === habitId ? res.data : h)),
      }));
      return res.data;
    } catch (err) {
      set({ error: "Failed to update habit" });
      throw err;
    }
  },

  deleteHabit: async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      }));
    } catch (err) {
      set({ error: "Failed to delete habit" });
    }
  },

  completeHabit: async (habitId) => {
    try {
      const res = await api.post(`/habits/${habitId}/complete`);
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === habitId ? { ...h, completed_today: true } : h
        ),
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.detail || "Failed to complete habit" });
      throw err;
    }
  },

  fetchDailyProgress: async () => {
    try {
      const res = await api.get("/progress/daily");
      set({ dailyProgress: res.data });
    } catch {
      set({ error: "Failed to fetch daily progress" });
    }
  },
}));

export default useHabitStore;
