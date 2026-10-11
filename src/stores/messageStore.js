// stores/messageStore.js
import { create } from "zustand";

const API =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

export const useMessageStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  sendMessage: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message");
      }

      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message || "Failed to send message", loading: false });
      throw err;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
