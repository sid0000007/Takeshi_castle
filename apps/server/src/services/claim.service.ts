// Runs the server-authoritative tile claim flow with Redis and Postgres.
import type { LeaderboardEntry, PublicUser, TileState } from "@takeshi-castle/shared";
import { CLAIM_COOLDOWN_MS, TILE_LOCK_TTL_MS } from "@takeshi-castle/shared";

import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { AppError } from "../lib/http-error.js";
import { acquireLock } from "../lib/lock.js";
import { getTileById } from "../modules/game/game.repository.js";
import { getLeaderboard } from "../modules/leaderboard/leaderboard.repository.js";
import { updateCachedTile } from "./tile-cache.service.js";

function lockKey(tileId: string) {
  return `lock:tile:${tileId}`;
}

function cooldownKey(userId: string) {
  return `cooldown:user:${userId}`;
}

export type ClaimResult = {
  tile: TileState;
  leaderboard: LeaderboardEntry[];
};

export async function claimTile(tileId: string, user: PublicUser): Promise<ClaimResult> {
  const activeCooldown = await redis.get(cooldownKey(user.id));
  if (activeCooldown) {
    throw new AppError(429, "CLAIM_COOLDOWN", "You are claiming too quickly.");
  }

  const lock = await acquireLock(lockKey(tileId), env.TILE_LOCK_TTL_MS || TILE_LOCK_TTL_MS);
  if (!lock) {
    throw new AppError(409, "CLAIM_CONFLICT", "Another player is already claiming this tile.");
  }

  try {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const tileResult = await client.query<{
        id: string;
        session_id: string;
        owner_user_id: string | null;
      }>(
        `
          SELECT id, session_id, owner_user_id
          FROM tiles
          WHERE id = $1
          FOR UPDATE
        `,
        [tileId]
      );

      const tileRow = tileResult.rows[0];
      if (!tileRow) {
        throw new AppError(404, "TILE_NOT_FOUND", "Tile not found.");
      }

      if (tileRow.owner_user_id) {
        throw new AppError(409, "TILE_ALREADY_CLAIMED", "Tile already claimed.");
      }

      await client.query(
        `
          UPDATE tiles
          SET owner_user_id = $2,
              claimed_at = NOW(),
              updated_at = NOW(),
              version = version + 1
          WHERE id = $1
        `,
        [tileId, user.id]
      );

      await client.query(
        `
          INSERT INTO tile_claim_events (session_id, tile_id, user_id, previous_owner_user_id, source)
          VALUES ($1, $2, $3, NULL, 'click')
        `,
        [tileRow.session_id, tileId, user.id]
      );

      await client.query(
        `
          INSERT INTO user_stats (user_id, total_claims, tiles_owned)
          VALUES ($1, 1, 1)
          ON CONFLICT (user_id)
          DO UPDATE
          SET total_claims = user_stats.total_claims + 1,
              tiles_owned = user_stats.tiles_owned + 1,
              updated_at = NOW()
        `,
        [user.id]
      );

      await client.query(
        `
          INSERT INTO user_cooldowns (user_id, last_claim_at)
          VALUES ($1, NOW())
          ON CONFLICT (user_id)
          DO UPDATE SET last_claim_at = EXCLUDED.last_claim_at
        `,
        [user.id]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    await redis.set(cooldownKey(user.id), "1", "PX", env.CLAIM_COOLDOWN_MS || CLAIM_COOLDOWN_MS);
    const tile = await getTileById(tileId);

    if (!tile) {
      throw new AppError(404, "TILE_NOT_FOUND", "Tile not found.");
    }

    await updateCachedTile(tile);
    const leaderboard = await getLeaderboard();

    return {
      tile,
      leaderboard
    };
  } finally {
    await lock.release();
  }
}
