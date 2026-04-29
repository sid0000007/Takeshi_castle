import type { PublicUser } from "@takeshi-castle/shared";

declare global {
  namespace Express {
    interface Request {
      user: PublicUser;
      token: string;
    }
  }
}

export {};
