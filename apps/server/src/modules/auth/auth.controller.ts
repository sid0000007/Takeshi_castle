// Handles HTTP auth requests and returns guest login results.
import type { Request, Response } from "express";

import { success } from "../../lib/response.js";
import { guestLoginSchema } from "./auth.schema.js";
import { guestLogin } from "./auth.service.js";

export async function guestLoginController(req: Request, res: Response) {
  const payload = guestLoginSchema.parse(req.body);
  const auth = await guestLogin(payload);

  res.status(201).json(success(auth));
}
