// Reads game sessions and tile state from PostgreSQL.
import type { GameSession, GameState, TileState } from "@takeshi-castle/shared";

import { db } from "../../config/db.js";

type TileRow = {
  id: string;
  session_id: string;
  row_index: number;
  col_index: number;
  claimed_at: Date | null;
  version: number;
  owner_id: string | null;
  owner_username: string | null;
  owner_color: string | null;
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
          username: row.owner_username ?? "Unknown",
          color: row.owner_color ?? "#94a3b8"
        }
      : null
  };
}

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
        u.username AS owner_username,
        u.color AS owner_color
      FROM tiles t
      LEFT JOIN users u ON u.id = t.owner_user_id
      WHERE t.session_id = $1
      ORDER BY t.row_index ASC, t.col_index ASC
    `,
    [sessionId]
  );

  return {
    session,
    tiles: result.rows.map(mapTile)
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
        u.username AS owner_username,
        u.color AS owner_color
      FROM tiles t
      LEFT JOIN users u ON u.id = t.owner_user_id
      WHERE t.id = $1
      LIMIT 1
    `,
    [tileId]
  );

  return result.rows[0] ? mapTile(result.rows[0]) : null;
}
