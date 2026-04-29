// Extends Socket.IO typing so handlers can access the authenticated user.
import type { PublicUser } from "@takeshi-castle/shared";

declare module "socket.io" {
  interface Socket {
    user?: PublicUser;
  }
}
