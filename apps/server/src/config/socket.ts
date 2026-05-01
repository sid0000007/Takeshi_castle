// Keeps shared Socket.IO server options in one place.
import type { ServerOptions } from "socket.io";

import { env } from "./env.js";

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN,
    credentials: false
  }
};
