// Reads the bearer token and attaches the authenticated user to the request.
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/http-error.js";
import { verifyToken } from "../lib/jwt.js";
import { resolveAuthenticatedUser } from "../modules/auth/auth.service.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    next(new AppError(401, "UNAUTHORIZED", "Missing bearer token."));
    return;
  }

  try {
    const auth = verifyToken(token);
    req.auth = auth;
    req.user = await resolveAuthenticatedUser(auth);
    req.token = token;
    next();
  } catch {
    next(new AppError(401, "UNAUTHORIZED", "Invalid bearer token."));
  }
}
