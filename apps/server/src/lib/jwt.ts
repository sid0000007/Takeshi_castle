// Wraps JWT signing and verification for guest user authentication.
import jwt from "jsonwebtoken";

import type { PublicUser } from "@takeshi-castle/shared";

import { env } from "../config/env.js";

type AuthTokenPayload = {
  sub: string;
  username: string;
  color: string;
};

export function signToken(user: PublicUser) {
  return jwt.sign(
    {
      username: user.username,
      color: user.color
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: "7d"
    }
  );
}

export function verifyToken(token: string): PublicUser {
  const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

  return {
    id: payload.sub,
    username: payload.username,
    color: payload.color
  };
}
