// Registers tile claim endpoints for the API.
import { Router } from "express";

import { claimTileController } from "./tiles.controller.js";

export const tilesRoutes = Router();

tilesRoutes.post("/:tileId/claim", (req, res, next) => {
  void claimTileController(req, res).catch(next);
});
