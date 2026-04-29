// Assembles the active game state and keeps the Redis cache warm.
import { getActiveSession, getGameState } from "./game.repository.js";
import { hydrateGameStateCache } from "../../services/tile-cache.service.js";

export async function getCurrentGameState() {
  const session = await getActiveSession();
  const state = await getGameState(session.id);
  await hydrateGameStateCache(state);
  return state;
}
