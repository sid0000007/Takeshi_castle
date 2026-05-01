import type { ApiResponse, GameStateResponse, LeaderboardResponse } from "@takeshi-castle/shared";

import { api } from "../../services/api.js";
import { getResponseErrorMessage } from "../../services/api-errors.js";

export async function fetchGameState() {
  const response = await api.get<ApiResponse<GameStateResponse>>("/game/state");
  if (!response.data.success) {
    throw new Error(getResponseErrorMessage(response.data, "Failed to load game state."));
  }

  return response.data.data;
}

export async function fetchLeaderboard() {
  const response = await api.get<ApiResponse<LeaderboardResponse>>("/leaderboard");
  if (!response.data.success) {
    throw new Error(getResponseErrorMessage(response.data, "Failed to load leaderboard."));
  }

  return response.data.data;
}

export async function resetGame() {
  const response = await api.post<ApiResponse<{ reset: boolean }>>("/admin/reset");

  if (!response.data.success) {
    throw new Error(getResponseErrorMessage(response.data, "Failed to reset the game."));
  }

  return response.data.data;
}
