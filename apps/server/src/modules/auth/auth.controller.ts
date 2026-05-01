// Handles HTTP auth requests for guest, email/password, and session flows.
import type { Request, Response } from "express";

import { success } from "../../lib/response.js";
import { guestLoginSchema, loginSchema, registerSchema } from "./auth.schema.js";
import { getSessionAuth, guestLogin, loginUser, registerUser } from "./auth.service.js";

export async function guestLoginController(req: Request, res: Response) {
  const payload = guestLoginSchema.parse(req.body);
  const auth = await guestLogin(payload);

  res.status(201).json(success(auth));
}

export async function registerController(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);
  const auth = await registerUser(payload);

  res.status(201).json(success(auth));
}

export async function loginController(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const auth = await loginUser(payload);

  res.json(success(auth));
}

export async function getSessionController(req: Request, res: Response) {
  const auth = await getSessionAuth(req.user);
  res.json(success(auth));
}
