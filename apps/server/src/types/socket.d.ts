import type { PublicUser } from "@takeshi-castle/shared";

declare module "socket.io" {
  interface Socket {
    user?: PublicUser;
  }
}
