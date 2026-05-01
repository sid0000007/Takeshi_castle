// Assembles the active game state and keeps the Redis cache warm.
import { getActiveSession, getGameState, getPlayerOverview } from "./game.repository.js";
import { hydrateGameStateCache } from "../../services/tile-cache.service.js";
import { getOnlineUserIds } from "../../services/presence.service.js";

export async function getCurrentGameState() {
  const session = await getActiveSession();
  const state = await getGameState(session.id);
  state.players = await getPlayerOverview(session.id, getOnlineUserIds(session.id));
  await hydrateGameStateCache(state);
  return state;
}
