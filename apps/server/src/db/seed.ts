// Seeds the active game session and default tile grid for local startup.
import { env } from "../config/env.js";
import { db } from "../config/db.js";

export async function seedDatabase() {
  const existingSession = await db.query<{ id: string }>(
    `
      SELECT id
      FROM game_sessions
      WHERE status = 'active'
      LIMIT 1
    `
  );

  if (existingSession.rowCount && existingSession.rows[0]) {
    return;
  }

  const sessionResult = await db.query<{ id: string }>(
    `
      INSERT INTO game_sessions (name, status, grid_rows, grid_cols)
      VALUES ($1, 'active', $2, $3)
      RETURNING id
    `,
    [env.ACTIVE_SESSION_NAME, env.GRID_ROWS, env.GRID_COLS]
  );

  const sessionId = sessionResult.rows[0]?.id;
  if (!sessionId) {
    throw new Error("Failed to create active session.");
  }

  for (let row = 0; row < env.GRID_ROWS; row += 1) {
    for (let col = 0; col < env.GRID_COLS; col += 1) {
      await db.query(
        `
          INSERT INTO tiles (session_id, row_index, col_index)
          VALUES ($1, $2, $3)
          ON CONFLICT (session_id, row_index, col_index) DO NOTHING
        `,
        [sessionId, row, col]
      );
    }
  }
}

if (process.argv[1]?.endsWith("seed.ts")) {
  void seedDatabase()
    .then(async () => {
      await db.end();
    })
    .catch(async (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      await db.end();
      process.exit(1);
    });
}
