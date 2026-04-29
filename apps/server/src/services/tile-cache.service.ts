// Stores and updates tile state snapshots in Redis for fast realtime reads.
import type { GameState, TileState } from "@takeshi-castle/shared";

import { redis } from "../config/redis.js";

function gridKey(sessionId: string) {
  return `game:${sessionId}:grid`;
}

export async function hydrateGameStateCache(state: GameState) {
  const key = gridKey(state.session.id);
  const entries = state.tiles.flatMap((tile) => [
    tile.id,
    JSON.stringify(tile)
  ]);

  if (entries.length > 0) {
    await redis.hset(key, ...entries);
  }
}

export async function updateCachedTile(tile: TileState) {
  await redis.hset(gridKey(tile.sessionId), tile.id, JSON.stringify(tile));
}

export async function getCachedGameTiles(sessionId: string): Promise<TileState[] | null> {
  const result = await redis.hgetall(gridKey(sessionId));
  const values = Object.values(result);

  if (values.length === 0) {
    return null;
  }

  return values.map((value) => JSON.parse(value) as TileState);
}
