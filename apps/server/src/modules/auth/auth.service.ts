import type { AuthResponse, PublicUser } from "@takeshi-castle/shared";

import { db } from "../../config/db.js";
import { signToken } from "../../lib/jwt.js";

const fallbackColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899"
];

function sanitizeUsername(username: string) {
  return username.replace(/\s+/g, " ").trim();
}

async function ensureUniqueUsername(baseUsername: string) {
  let candidate = baseUsername;
  let suffix = 1;

  while (true) {
    const result = await db.query<{ id: string }>(
      "SELECT id FROM users WHERE username = $1 LIMIT 1",
      [candidate]
    );

    if (!result.rowCount) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseUsername}-${suffix}`;
  }
}

export async function guestLogin(input: {
  username: string;
  color?: string | undefined;
}): Promise<AuthResponse> {
  const username = await ensureUniqueUsername(sanitizeUsername(input.username));
  const color = input.color ?? fallbackColors[Math.floor(Math.random() * fallbackColors.length)] ?? "#22c55e";

  const userResult = await db.query<PublicUser>(
    `
      INSERT INTO users (username, color)
      VALUES ($1, $2)
      RETURNING id, username, color
    `,
    [username, color]
  );

  const user = userResult.rows[0];
  if (!user) {
    throw new Error("Failed to create guest user.");
  }

  await db.query(
    `
      INSERT INTO user_stats (user_id, total_claims, tiles_owned)
      VALUES ($1, 0, 0)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [user.id]
  );

  return {
    token: signToken(user),
    user
  };
}
