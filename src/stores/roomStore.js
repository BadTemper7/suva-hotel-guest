/* -------------------- roomStore.js -------------------- */
import { create } from "zustand";

const API_URL =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

export const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,
  error: null,

  fetchRooms: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/rooms?${query}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch rooms");
      }

      const data = await res.json();
      set({ rooms: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch rooms", loading: false });
    }
  },
}));
