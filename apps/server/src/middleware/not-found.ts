// Returns a standard 404 response for unknown routes.
import type { Request, Response } from "express";

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found."
    }
  });
}
