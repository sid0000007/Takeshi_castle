import type { GameState, LeaderboardEntry, PublicUser } from "./game.js";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

export type GameStateResponse = GameState;

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
};
