// Reads ranked player stats from PostgreSQL for the leaderboard.
import type { LeaderboardEntry } from "@takeshi-castle/shared";

import { db } from "../../config/db.js";

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const result = await db.query<{
    id: string;
    email: string | null;
    username: string;
    color: string;
    role: "admin" | "player";
    total_claims: number;
    tiles_owned: number;
  }>(
    `
      SELECT
        u.id,
        u.email,
        u.username,
        u.color,
        u.role,
        us.total_claims,
        us.tiles_owned
      FROM user_stats us
      INNER JOIN users u ON u.id = us.user_id
      ORDER BY us.tiles_owned DESC, us.total_claims DESC, u.created_at ASC
      LIMIT 10
    `
  );

  return result.rows.map((row, index) => ({
    id: row.id,
    email: row.email,
    username: row.username,
    color: row.color,
    role: row.role,
    totalClaims: row.total_claims,
    tilesOwned: row.tiles_owned,
    rank: index + 1
  }));
}
