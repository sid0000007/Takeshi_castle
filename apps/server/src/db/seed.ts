// Seeds the active game session and default tile grid for local startup.
import { env } from "../config/env.js";
import { db } from "../config/db.js";
import { hashPassword } from "../lib/password.js";

async function ensureAdminUser() {
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
  const existingAdmin = await db.query<{ id: string }>(
    `
      SELECT id
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [env.ADMIN_EMAIL]
  );

  if (existingAdmin.rowCount && existingAdmin.rows[0]) {
    await db.query(
      `
        UPDATE users
        SET username = $2,
            password_hash = $3,
            color = $4,
            role = 'admin',
            is_guest = FALSE,
            updated_at = NOW()
        WHERE id = $1
      `,
      [existingAdmin.rows[0].id, env.ADMIN_USERNAME, passwordHash, env.ADMIN_COLOR]
    );
  } else {
    await db.query(
      `
        INSERT INTO users (email, username, password_hash, color, role, is_guest)
        VALUES ($1, $2, $3, $4, 'admin', FALSE)
      `,
      [env.ADMIN_EMAIL, env.ADMIN_USERNAME, passwordHash, env.ADMIN_COLOR]
    );
  }

  await db.query(
    `
      INSERT INTO user_stats (user_id, total_claims, tiles_owned)
      SELECT id, 0, 0
      FROM users
      WHERE lower(email) = lower($1)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [env.ADMIN_EMAIL]
  );
}

export async function seedDatabase() {
  await ensureAdminUser();

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
