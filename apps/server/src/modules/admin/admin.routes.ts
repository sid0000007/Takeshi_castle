// Registers admin-only routes such as resetting the active game.
import { Router } from "express";

import { adminMiddleware } from "../../middleware/admin.js";
import { resetGameController } from "./admin.controller.js";

export const adminRoutes = Router();

adminRoutes.post("/reset", adminMiddleware, (req, res, next) => {
  void resetGameController(req, res).catch(next);
});
