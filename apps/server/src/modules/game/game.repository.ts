// Reads game sessions and tile state from PostgreSQL.
import type { GameSession, GameState, LivePlayerOverview, TileState } from "@takeshi-castle/shared";

import { db } from "../../config/db.js";

type TileRow = {
  id: string;
  session_id: string;
  row_index: number;
  col_index: number;
  claimed_at: Date | null;
  version: number;
  owner_id: string | null;
  owner_email: string | null;
  owner_username: string | null;
  owner_color: string | null;
  owner_role: "admin" | "player" | null;
};

function mapTile(row: TileRow): TileState {
  return {
    id: row.id,
    sessionId: row.session_id,
    rowIndex: row.row_index,
    colIndex: row.col_index,
    claimedAt: row.claimed_at?.toISOString() ?? null,
    version: row.version,
    owner: row.owner_id
      ? {
          id: row.owner_id,
          email: row.owner_email,
          username: row.owner_username ?? "Unknown",
          color: row.owner_color ?? "#94a3b8",
          role: row.owner_role ?? "player"
        }
      : null
  };
}

type PlayerOverviewRow = {
  id: string;
  email: string | null;
  username: string;
  color: string;
  role: "admin" | "player";
  total_claims: number;
  tiles_owned: number;
  avg_row: number | null;
  avg_col: number | null;
  last_claimed_at: Date | null;
};

export async function getActiveSession(): Promise<GameSession> {
  const result = await db.query<{
    id: string;
    name: string;
    status: GameSession["status"];
    grid_rows: number;
    grid_cols: number;
  }>(
    `
      SELECT id, name, status, grid_rows, grid_cols
      FROM game_sessions
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Active game session not found.");
  }

  return {
    id: row.id,
    name: row.name,
    status: row.status,
    gridRows: row.grid_rows,
    gridCols: row.grid_cols
  };
}

export async function getGameState(sessionId: string): Promise<GameState> {
  const session = await getActiveSession();
  const result = await db.query<TileRow>(
    `
      SELECT
        t.id,
        t.session_id,
        t.row_index,
        t.col_index,
        t.claimed_at,
        t.version,
        u.id AS owner_id,
        u.email AS owner_email,
        u.username AS owner_username,
        u.color AS owner_color,
        u.role AS owner_role
      FROM tiles t
      LEFT JOIN users u ON u.id = t.owner_user_id
      WHERE t.session_id = $1
      ORDER BY t.row_index ASC, t.col_index ASC
    `,
    [sessionId]
  );

  return {
    session,
    tiles: result.rows.map(mapTile),
    players: []
  };
}

export async function getTileById(tileId: string) {
  const result = await db.query<TileRow>(
    `
      SELECT
        t.id,
        t.session_id,
        t.row_index,
        t.col_index,
        t.claimed_at,
        t.version,
        u.id AS owner_id,
        u.email AS owner_email,
        u.username AS owner_username,
        u.color AS owner_color,
        u.role AS owner_role
      FROM tiles t
      LEFT JOIN users u ON u.id = t.owner_user_id
      WHERE t.id = $1
      LIMIT 1
    `,
    [tileId]
  );

  return result.rows[0] ? mapTile(result.rows[0]) : null;
}

export async function getPlayerOverview(
  sessionId: string,
  onlineUserIds: string[]
): Promise<LivePlayerOverview[]> {
  const result = await db.query<PlayerOverviewRow>(
    `
      SELECT
        u.id,
        u.email,
        u.username,
        u.color,
        u.role,
        COALESCE(us.total_claims, 0) AS total_claims,
        COALESCE(us.tiles_owned, 0) AS tiles_owned,
        AVG(t.row_index)::float AS avg_row,
        AVG(t.col_index)::float AS avg_col,
        MAX(t.claimed_at) AS last_claimed_at
      FROM users u
      LEFT JOIN user_stats us ON us.user_id = u.id
      LEFT JOIN tiles t
        ON t.owner_user_id = u.id
       AND t.session_id = $1
      WHERE u.role = 'player'
        AND (
          us.user_id IS NOT NULL
          OR EXISTS (
            SELECT 1
            FROM tile_claim_events e
            WHERE e.user_id = u.id
              AND e.session_id = $1
          )
        )
      GROUP BY u.id, u.email, u.username, u.color, u.role, us.total_claims, us.tiles_owned
      ORDER BY COALESCE(us.tiles_owned, 0) DESC, COALESCE(us.total_claims, 0) DESC, u.username ASC
    `,
    [sessionId]
  );

  const onlineSet = new Set(onlineUserIds);

  return result.rows.map((row) => ({
    user: {
      id: row.id,
      email: row.email,
      username: row.username,
      color: row.color,
      role: row.role
    },
    totalClaims: row.total_claims,
    tilesOwned: row.tiles_owned,
    averagePosition:
      row.avg_row === null || row.avg_col === null
        ? null
        : {
            rowIndex: Math.round(row.avg_row),
            colIndex: Math.round(row.avg_col)
          },
    isOnline: onlineSet.has(row.id),
    lastClaimedAt: row.last_claimed_at?.toISOString() ?? null
  }));
}
