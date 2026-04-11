import { create } from "zustand";
import api from "../api/client";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.access_token);
      set({ token: res.data.access_token, loading: false });
      const userRes = await api.get("/auth/me");
      set({ user: userRes.data });
    } catch (err) {
      set({
        error: err.response?.data?.detail || err.message || "Registration failed",
        loading: false,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      set({ token: res.data.access_token, loading: false });
      const userRes = await api.get("/auth/me");
      set({ user: userRes.data });
    } catch (err) {
      set({
        error: err.response?.data?.detail || err.message || "Login failed",
        loading: false,
      });
      throw err;
    }
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
