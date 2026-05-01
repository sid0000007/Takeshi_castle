// Extends Socket.IO typing so handlers can access the authenticated user.
import type { PublicUser } from "@takeshi-castle/shared";
import type { VerifiedToken } from "../lib/jwt.js";

declare module "socket.io" {
  interface Socket {
    user?: PublicUser;
    auth?: VerifiedToken;
  }
}
