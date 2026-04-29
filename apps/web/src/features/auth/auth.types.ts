import type { PublicUser } from "@takeshi-castle/shared";

export type AuthState = {
  token: string | null;
  user: PublicUser | null;
  setAuth: (payload: { token: string; user: PublicUser }) => void;
  clearAuth: () => void;
};
