// Creates users, validates credentials, and returns revocable auth tokens.
import type { AuthResponse, PublicUser } from "@takeshi-castle/shared";

import { db } from "../../config/db.js";
import { AppError } from "../../lib/http-error.js";
import { signToken } from "../../lib/jwt.js";
import type { VerifiedToken } from "../../lib/jwt.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";

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

type UserRow = {
  id: string;
  email: string | null;
  username: string;
  color: string;
  role: PublicUser["role"];
  auth_version: number;
  password_hash: string | null;
};

function mapUser(row: Pick<UserRow, "id" | "email" | "username" | "color" | "role">): PublicUser {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    color: row.color,
    role: row.role
  };
}

async function getUserByEmail(email: string) {
  const result = await db.query<UserRow>(
    `
      SELECT id, email, username, color, role, auth_version, password_hash
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] ?? null;
}

async function getUserById(id: string) {
  const result = await db.query<UserRow>(
    `
      SELECT id, email, username, color, role, auth_version, password_hash
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

function buildAuthResponse(user: UserRow | PublicUser, authVersion: number): AuthResponse {
  const publicUser = "auth_version" in user ? mapUser(user) : user;

  return {
    token: signToken(publicUser, authVersion),
    user: publicUser
  };
}

export async function guestLogin(input: {
  username: string;
  color?: string | undefined;
}): Promise<AuthResponse> {
  const username = await ensureUniqueUsername(sanitizeUsername(input.username));
  const color = input.color ?? fallbackColors[Math.floor(Math.random() * fallbackColors.length)] ?? "#22c55e";

  const userResult = await db.query<UserRow>(
    `
      INSERT INTO users (username, color, email, role, is_guest)
      VALUES ($1, $2, NULL, 'player', TRUE)
      RETURNING id, email, username, color, role, auth_version, password_hash
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

  return buildAuthResponse(userResult.rows[0]!, userResult.rows[0]!.auth_version);
}

export async function registerUser(input: {
  email: string;
  username: string;
  password: string;
  color: string;
}): Promise<AuthResponse> {
  const existingUser = await getUserByEmail(input.email);
  if (existingUser) {
    throw new AppError(409, "EMAIL_ALREADY_USED", "An account with that email already exists.");
  }

  const username = await ensureUniqueUsername(sanitizeUsername(input.username));
  const passwordHash = await hashPassword(input.password);

  const userResult = await db.query<UserRow>(
    `
      INSERT INTO users (email, username, password_hash, color, role, is_guest)
      VALUES ($1, $2, $3, $4, 'player', FALSE)
      RETURNING id, email, username, color, role, auth_version, password_hash
    `,
    [input.email, username, passwordHash, input.color]
  );

  const user = userResult.rows[0];
  if (!user) {
    throw new Error("Failed to create user.");
  }

  await db.query(
    `
      INSERT INTO user_stats (user_id, total_claims, tiles_owned)
      VALUES ($1, 0, 0)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [user.id]
  );

  return buildAuthResponse(user, user.auth_version);
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthResponse> {
  const user = await getUserByEmail(input.email);

  if (!user || !user.password_hash) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  const passwordMatches = await verifyPassword(input.password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  return buildAuthResponse(user, user.auth_version);
}

export async function resolveAuthenticatedUser(auth: VerifiedToken): Promise<PublicUser> {
  const user = await getUserById(auth.userId);

  if (!user || user.auth_version !== auth.authVersion) {
    throw new AppError(401, "UNAUTHORIZED", "Session is no longer valid.");
  }

  return mapUser(user);
}

export async function getSessionAuth(user: PublicUser): Promise<AuthResponse> {
  const fullUser = await getUserById(user.id);
  if (!fullUser) {
    throw new AppError(401, "UNAUTHORIZED", "Session is no longer valid.");
  }

  return buildAuthResponse(fullUser, fullUser.auth_version);
}
