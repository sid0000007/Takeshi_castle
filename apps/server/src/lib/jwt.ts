// Wraps JWT signing and verification for database-backed authentication.
import jwt from "jsonwebtoken";

import type { PublicUser } from "@takeshi-castle/shared";

import { env } from "../config/env.js";

type AuthTokenPayload = {
  sub: string;
  email: string | null;
  username: string;
  color: string;
  role: PublicUser["role"];
  authVersion: number;
};

export type VerifiedToken = {
  userId: string;
  authVersion: number;
  email: string | null;
  username: string;
  color: string;
  role: PublicUser["role"];
};

export function signToken(user: PublicUser, authVersion: number) {
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
      color: user.color,
      role: user.role,
      authVersion
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: "7d"
    }
  );
}

export function verifyToken(token: string): VerifiedToken {
  const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

  return {
    userId: payload.sub,
    email: payload.email,
    username: payload.username,
    color: payload.color,
    role: payload.role,
    authVersion: payload.authVersion
  };
}
