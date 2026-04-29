// Handles HTTP requests that need the current board state.
import type { Request, Response } from "express";

import { success } from "../../lib/response.js";
import { getCurrentGameState } from "./game.service.js";

export async function getGameStateController(_req: Request, res: Response) {
  const state = await getCurrentGameState();
  res.json(success(state));
}
