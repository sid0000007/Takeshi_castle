// Handles HTTP requests for leaderboard data.
import type { Request, Response } from "express";

import { success } from "../../lib/response.js";
import { listLeaderboard } from "./leaderboard.service.js";

export async function getLeaderboardController(_req: Request, res: Response) {
  const leaderboard = await listLeaderboard();
  res.json(success(leaderboard));
}
