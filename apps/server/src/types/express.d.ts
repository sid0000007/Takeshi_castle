// Extends Express request typing with the authenticated user and token.
import type { PublicUser } from "@takeshi-castle/shared";
import type { VerifiedToken } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user: PublicUser;
      token: string;
      auth: VerifiedToken;
    }
  }
}

export {};
