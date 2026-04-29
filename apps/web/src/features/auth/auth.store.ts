import { create } from "zustand";

import { disconnectSocket } from "../../services/socket.js";
import type { AuthState } from "./auth.types.js";

const storageKey = "takeshi-castle-auth";

function getInitialState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return {
      token: null,
      user: null
    };
  }

  try {
    const parsed = JSON.parse(raw) as { token: string | null; user: AuthState["user"] };
    return parsed;
  } catch {
    return {
      token: null,
      user: null
    };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  setAuth: ({ token, user }) => {
    localStorage.setItem(storageKey, JSON.stringify({ token, user }));
    set({ token, user });
  },
  clearAuth: () => {
    disconnectSocket();
    localStorage.removeItem(storageKey);
    set({ token: null, user: null });
  }
}));
