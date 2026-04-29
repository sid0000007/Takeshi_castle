// Registers routes related to loading the active game state.
import { Router } from "express";

import { getGameStateController } from "./game.controller.js";

export const gameRoutes = Router();

gameRoutes.get("/state", (req, res, next) => {
  void getGameStateController(req, res).catch(next);
});
