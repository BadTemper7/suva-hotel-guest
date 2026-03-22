// stores/messageStore.js
import { create } from "zustand";
import { getToken } from "../app/auth.js";

const API =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

export const useMessageStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  sendMessage: async (payload) => {
    console.log("🚀 sendMessage called with payload:", payload);
    set({ loading: true, error: null });

    try {
      // Get guest token from your auth.js
      const token = getToken(); // This will get from localStorage with key "suva_guest_token"
      console.log(
        "🔑 Token found:",
        token ? `Yes (${token.substring(0, 20)}...)` : "No",
      );

      const headers = {
        "Content-Type": "application/json",
      };

      // Add guest token if authenticated
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("📧 Sending message with guest authentication");
      } else {
        console.log("📧 Sending message as unauthenticated guest");
      }

      console.log("📡 Making API request to:", `${API}/messages`);
      console.log("📦 Headers:", headers);
      console.log("📦 Payload:", payload);

      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📡 Response data:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message");
      }

      set({ loading: false });
      return data;
    } catch (err) {
      console.error("❌ Error sending message:", err);
      set({ error: err.message || "Failed to send message", loading: false });
      throw err;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
