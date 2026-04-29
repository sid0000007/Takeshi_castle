// Registers leaderboard endpoints for the client UI.
import { Router } from "express";

import { getLeaderboardController } from "./leaderboard.controller.js";

export const leaderboardRoutes = Router();

leaderboardRoutes.get("/", (req, res, next) => {
  void getLeaderboardController(req, res).catch(next);
});
