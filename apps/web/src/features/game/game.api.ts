import type { ApiResponse, GameStateResponse, LeaderboardResponse } from "@takeshi-castle/shared";

import { api } from "../../services/api.js";

export async function fetchGameState() {
  const response = await api.get<ApiResponse<GameStateResponse>>("/game/state");
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

export async function fetchLeaderboard() {
  const response = await api.get<ApiResponse<LeaderboardResponse>>("/leaderboard");
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}
