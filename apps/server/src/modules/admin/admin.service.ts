// Resets the active game and revokes all non-admin player sessions.
import { getCurrentGameState } from "../game/game.service.js";
import { getLeaderboard } from "../leaderboard/leaderboard.repository.js";
import { db } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { getSocketServer, revokeNonAdminSockets } from "../../sockets/index.js";

export async function resetGameAndRevokePlayers() {
  const sessionResult = await db.query<{ id: string }>(
    `
      SELECT id
      FROM game_sessions
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `
  );

  const sessionId = sessionResult.rows[0]?.id;
  if (!sessionId) {
    throw new Error("Active game session not found.");
  }

  await db.query("BEGIN");

  try {
    await db.query(
      `
        UPDATE tiles
        SET owner_user_id = NULL,
            claimed_at = NULL,
            updated_at = NOW(),
            version = version + 1
        WHERE session_id = $1
      `,
      [sessionId]
    );

    await db.query("DELETE FROM tile_claim_events WHERE session_id = $1", [sessionId]);
    await db.query(
      `
        UPDATE user_stats
        SET total_claims = 0,
            tiles_owned = 0,
            updated_at = NOW()
      `
    );
    await db.query("DELETE FROM user_cooldowns");
    await db.query(
      `
        UPDATE users
        SET auth_version = auth_version + 1,
            updated_at = NOW()
        WHERE role <> 'admin'
      `
    );

    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }

  await redis.del(`game:${sessionId}:grid`);

  const io = getSocketServer();
  if (io) {
    io.emit("game_reset");
    await revokeNonAdminSockets("The board was reset by an admin. Please sign in again.");

    const gameState = await getCurrentGameState();
    const leaderboard = await getLeaderboard();

    io.emit("game_state", gameState);
    io.emit("players_updated", { players: gameState.players });
    io.emit("leaderboard_updated", { entries: leaderboard });
  }
}
