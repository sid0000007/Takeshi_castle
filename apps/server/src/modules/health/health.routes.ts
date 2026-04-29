import { Router } from "express";

import { getHealthStatus } from "./health.controller.js";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  res.json(getHealthStatus());
});
