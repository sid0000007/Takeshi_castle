// Registers auth endpoints for guest and email/password login flows.
import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.js";
import {
  getSessionController,
  guestLoginController,
  loginController,
  registerController
} from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/guest-login", (req, res, next) => {
  void guestLoginController(req, res).catch(next);
});

authRoutes.post("/register", (req, res, next) => {
  void registerController(req, res).catch(next);
});

authRoutes.post("/login", (req, res, next) => {
  void loginController(req, res).catch(next);
});

authRoutes.get("/session", authMiddleware, (req, res, next) => {
  void getSessionController(req, res).catch(next);
});
