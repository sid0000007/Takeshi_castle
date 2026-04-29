import { Router } from "express";

import { guestLoginController } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/guest-login", (req, res, next) => {
  void guestLoginController(req, res).catch(next);
});
