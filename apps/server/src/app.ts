// Builds the Express app with shared middleware and API route mounting.
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { gameRoutes } from "./modules/game/game.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { leaderboardRoutes } from "./modules/leaderboard/leaderboard.routes.js";
import { tilesRoutes } from "./modules/tiles/tiles.routes.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorMiddleware } from "./middleware/error.js";
import { notFoundMiddleware } from "./middleware/not-found.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json());

  app.use("/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/game", authMiddleware, gameRoutes);
  app.use("/api/tiles", authMiddleware, tilesRoutes);
  app.use("/api/leaderboard", authMiddleware, leaderboardRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
