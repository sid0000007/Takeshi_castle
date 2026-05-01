// Restricts routes to authenticated admin users only.
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/http-error.js";

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.user.role !== "admin") {
    next(new AppError(403, "FORBIDDEN", "Admin access is required."));
    return;
  }

  next();
}
