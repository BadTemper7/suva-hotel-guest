// src/stores/guestStore.js
import { create } from "zustand";
import {
  setAuthed,
  setToken,
  setUser,
  getUser,
  getToken,
  logout as authLogout,
  isAuthed,
} from "../app/auth.js";

const API =
  import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_LOCAL;

async function safeJson(res) {
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const msg =
      (isJson && data && (data.message || data.error)) ||
      (!isJson && typeof data === "string" && data.trim()) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const useGuestStore = create((set, get) => ({
  // State
  guests: [],
  currentGuest: null,
  loading: false,
  error: null,
  guestExists: false,
  checkingEmail: false,

  // Authentication state
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  needsRegistration: false,
  initialized: false,

  // Initialize store - check existing session
  initialize: () => {
    const storedUser = getUser();
    const authed = isAuthed();
    const storedToken = getToken();

    if (storedUser && authed && storedToken) {
      set({
        currentGuest: storedUser,
        isAuthenticated: true,
        guestExists: true,
        initialized: true,
      });
    } else {
      set({ initialized: true });
    }
  },

  // Check authentication status
  checkAuth: async () => {
    const { initialize } = get();
    initialize();
    return get().isAuthenticated;
  },

  // Get current guest
  getCurrentGuest: () => {
    const { currentGuest, isAuthenticated } = get();
    return isAuthenticated ? currentGuest : null;
  },

  // ==================== AUTHENTICATION METHODS ====================

  // Register new guest account
  registerGuest: async (guestData) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch(`${API}/guests/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      });
      const data = await safeJson(res);

      if (data.success) {
        const guest = data.guest;

        // After registration, automatically log in to get token
        const loginResult = await get().loginGuest(
          guestData.email,
          guestData.password,
        );

        if (loginResult.success) {
          return loginResult;
        }

        set({
          currentGuest: guest,
          isAuthenticated: false,
          authLoading: false,
        });

        return { success: true, guest, message: data.message };
      } else {
        set({
          authLoading: false,
          authError: data.message,
        });
        return { success: false, error: data.message };
      }
    } catch (err) {
      set({ authLoading: false, authError: err.message });
      throw err;
    }
  },

  // Login guest account
  loginGuest: async (email, password) => {
    set({ authLoading: true, authError: null, needsRegistration: false });
    try {
      const res = await fetch(`${API}/guests/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await safeJson(res);

      if (data.success) {
        const guest = data.guest;
        const token = data.token;

        // Store auth data using your auth.js functions
        setAuthed(true);
        setToken(token);
        setUser(guest);

        set({
          currentGuest: guest,
          isAuthenticated: true,
          authLoading: false,
          authError: null,
          guestExists: true,
        });

        return { success: true, guest, token, message: data.message };
      } else {
        set({
          authLoading: false,
          authError: data.message,
          needsRegistration: data.needsRegistration || false,
        });
        return {
          success: false,
          error: data.message,
          needsRegistration: data.needsRegistration,
        };
      }
    } catch (err) {
      set({ authLoading: false, authError: err.message });
      throw err;
    }
  },

  // Change password
  changePassword: async (newPassword, confirmPassword) => {
    set({ loading: true, error: null });
    try {
      const { currentGuest } = get();
      if (!currentGuest || !currentGuest._id) {
        throw new Error("No guest logged in");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (/\s/.test(newPassword)) {
        throw new Error("Password cannot contain spaces");
      }

      const res = await fetch(`${API}/guests/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: currentGuest._id,
          newPassword,
        }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // Update local storage with new user data
      const updatedGuest = data.guest || currentGuest;
      setUser(updatedGuest);

      set({
        currentGuest: updatedGuest,
        loading: false,
      });

      return { success: true, message: data.message };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Logout guest
  logoutGuest: () => {
    authLogout(); // This clears all auth data
    set({
      currentGuest: null,
      isAuthenticated: false,
      authError: null,
      guestExists: false,
      needsRegistration: false,
    });
  },

  // Upgrade walk-in guest to registered account
  upgradeToAccount: async (guestId, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests/upgrade-to-account/${guestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await safeJson(res);

      if (data.success) {
        const guest = data.guest;

        // Update auth storage
        setAuthed(true);
        setUser(guest);

        set({
          guests: get().guests.map((g) => (g._id === guestId ? guest : g)),
          currentGuest: guest,
          isAuthenticated: true,
          loading: false,
        });

        return { success: true, guest, message: data.message };
      } else {
        set({ loading: false, error: data.message });
        return { success: false, error: data.message };
      }
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests/reset-password-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await safeJson(res);

      set({ loading: false });
      return {
        success: true,
        message: data.message,
        resetToken: data.resetToken,
      };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await safeJson(res);

      set({ loading: false });
      return { success: true, message: data.message };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },
  // ==================== GUEST MANAGEMENT METHODS ====================

  // Find guest by email
  findGuestByEmail: async (email) => {
    set({ checkingEmail: true, error: null, guestExists: false });

    if (!email) {
      set({ checkingEmail: false });
      return { exists: false, guest: null, hasAccount: false };
    }

    try {
      const response = await fetch(
        `${API}/guests/find-by-email?email=${encodeURIComponent(email)}`,
      );
      const data = await safeJson(response);

      if (data.success) {
        if (data.exists && data.guest) {
          set({
            currentGuest: data.guest,
            guestExists: true,
            checkingEmail: false,
            needsRegistration:
              !data.guest.hasAccount && data.guest.email !== null,
          });
          return {
            exists: true,
            guest: data.guest,
            hasAccount: data.guest.hasAccount || false,
            accountType: data.guest.accountType || "walk-in",
          };
        } else {
          set({
            currentGuest: null,
            guestExists: false,
            checkingEmail: false,
            needsRegistration: false,
          });
          return { exists: false, guest: null, hasAccount: false };
        }
      } else {
        set({
          error: data.message || "Error checking guest email",
          checkingEmail: false,
        });
        return { exists: false, guest: null, hasAccount: false };
      }
    } catch (error) {
      console.error("Error finding guest by email:", error);
      set({
        error: error.message,
        checkingEmail: false,
      });
      return { exists: false, guest: null, hasAccount: false };
    }
  },

  // Create new guest (walk-in)
  createGuest: async (guestData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      });
      const data = await safeJson(res);
      const guest = data.guest || data;

      set((state) => ({
        guests: [guest, ...state.guests],
        currentGuest: guest,
        loading: false,
        guestExists: true,
      }));

      // If this is a registered account, store auth
      if (guest.hasAccount || guest.accountType === "registered") {
        setAuthed(true);
        setUser(guest);
        set({ isAuthenticated: true });
      }

      return guest;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Find or create guest by email
  findOrCreateGuestByEmail: async (
    guestData,
    createAccount = false,
    password = null,
  ) => {
    const { findGuestByEmail, createGuest, upgradeToAccount } = get();

    // First, try to find existing guest
    const result = await findGuestByEmail(guestData.email);

    if (result.exists && result.guest) {
      // Guest exists
      if (result.hasAccount) {
        // Has account - return existing
        return { guest: result.guest, isNew: false, hasAccount: true };
      } else if (createAccount && password) {
        // Walk-in upgrading to account
        const upgradeResult = await upgradeToAccount(
          result.guest._id,
          guestData.email,
          password,
        );
        if (upgradeResult.success) {
          return {
            guest: upgradeResult.guest,
            isNew: false,
            hasAccount: true,
            upgraded: true,
          };
        }
        throw new Error("Failed to upgrade to account");
      } else {
        // Walk-in without upgrade
        return { guest: result.guest, isNew: false, hasAccount: false };
      }
    } else {
      // Guest doesn't exist
      if (createAccount && password) {
        // Create as registered account
        const registerResult = await get().registerGuest({
          ...guestData,
          password,
        });
        if (registerResult.success) {
          return { guest: registerResult.guest, isNew: true, hasAccount: true };
        }
        throw new Error("Failed to create account");
      } else {
        // Create as walk-in
        try {
          const newGuest = await createGuest({
            ...guestData,
            accountType: "walk-in",
            hasAccount: false,
          });
          return { guest: newGuest, isNew: true, hasAccount: false };
        } catch (error) {
          console.error("Failed to create guest:", error);
          return {
            guest: null,
            isNew: false,
            hasAccount: false,
            error: error.message,
          };
        }
      }
    }
  },

  // Update guest (without password verification)
  updateGuest: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Don't send empty password
      const updateData = { ...updates };
      if (updateData.password === "" || updateData.password === null) {
        delete updateData.password;
      }

      const res = await fetch(`${API}/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await safeJson(res);
      const guest = data.guest || data;

      set((state) => ({
        guests: state.guests.map((g) => (g._id === id ? guest : g)),
        currentGuest:
          state.currentGuest?._id === id ? guest : state.currentGuest,
        loading: false,
      }));

      // Update localStorage if this is the current guest
      if (guest._id === get().currentGuest?._id) {
        setUser(guest);
      }

      return guest;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Get all guests
  fetchGuests: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests`);
      const data = await safeJson(res);
      const guests = Array.isArray(data)
        ? data
        : data.guests || data.data || [];

      set({ guests, loading: false });
      return guests;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Get guest by ID
  getGuestById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests/${id}`);
      const data = await safeJson(res);
      const guest = data.guest || data.data || data;

      set({ currentGuest: guest, loading: false, guestExists: true });
      return guest;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Delete multiple guests
  deleteMultipleGuests: async (guestIds) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API}/guests/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestIds }),
      });

      const data = await safeJson(response);

      if (response.ok) {
        set((state) => ({
          guests: state.guests.filter((guest) => !guestIds.includes(guest._id)),
          loading: false,
        }));
        return data;
      } else {
        set({
          error: data.message || "Failed to delete guests",
          loading: false,
        });
        throw new Error(data.message);
      }
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Delete single guest
  deleteGuest: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/guests/${id}`, {
        method: "DELETE",
      });
      const data = await safeJson(res);

      set((state) => ({
        guests: state.guests.filter((g) => g._id !== id),
        currentGuest:
          state.currentGuest?._id === id ? null : state.currentGuest,
        loading: false,
      }));

      // Clear auth if deleted guest was logged in
      if (get().currentGuest?._id === id) {
        get().logoutGuest();
      }

      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Clear current guest
  clearCurrentGuest: () => {
    set({
      currentGuest: null,
      guestExists: false,
      error: null,
      needsRegistration: false,
    });
  },

  // Clear error
  clearError: () => set({ error: null, authError: null }),

  // Get loading state
  isLoading: () => get().loading || get().authLoading,

  // Get checking email state
  isCheckingEmail: () => get().checkingEmail,

  // Get guest exists state
  doesGuestExist: () => get().guestExists,

  // Get authentication state
  isLoggedIn: () => get().isAuthenticated,

  // Get current guest name
  getGuestName: () => {
    const guest = get().currentGuest;
    if (!guest) return "";
    return `${guest.firstName} ${guest.lastName}`;
  },

  // Get guest email
  getGuestEmail: () => {
    const guest = get().currentGuest;
    return guest?.email || "";
  },

  // Check if guest has account
  hasAccount: () => {
    const guest = get().currentGuest;
    return guest?.hasAccount === true || guest?.accountType === "registered";
  },
}));
