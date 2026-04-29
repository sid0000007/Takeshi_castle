// Handles direct tile-claim HTTP requests as a backup to sockets.
import type { Request, Response } from "express";

import { AppError } from "../../lib/http-error.js";
import { success } from "../../lib/response.js";
import { claimTileForUser } from "./tiles.service.js";

export async function claimTileController(req: Request, res: Response) {
  const tileId = req.params.tileId;

  if (!tileId || Array.isArray(tileId)) {
    throw new AppError(400, "INVALID_TILE_ID", "Tile id is required.");
  }

  const result = await claimTileForUser(tileId, req.user);
  res.json(success(result));
}
