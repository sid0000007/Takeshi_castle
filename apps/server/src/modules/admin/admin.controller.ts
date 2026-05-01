// Handles admin-only actions for moderation and board control.
import type { Request, Response } from "express";

import { success } from "../../lib/response.js";
import { resetGameAndRevokePlayers } from "./admin.service.js";

export async function resetGameController(_req: Request, res: Response) {
  await resetGameAndRevokePlayers();
  res.json(success({ reset: true }));
}
