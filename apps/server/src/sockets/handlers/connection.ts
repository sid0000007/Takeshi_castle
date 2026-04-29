// Authenticates socket connections and exposes the current socket user.
import type { Server, Socket } from "socket.io";

import { AppError } from "../../lib/http-error.js";
import { verifyToken } from "../../lib/jwt.js";

export function attachConnectionAuth(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      next(new AppError(401, "UNAUTHORIZED", "Missing socket auth token."));
      return;
    }

    try {
      socket.user = verifyToken(token);
      next();
    } catch {
      next(new AppError(401, "UNAUTHORIZED", "Invalid socket auth token."));
    }
  });
}

export function requireSocketUser(socket: Socket) {
  if (!socket.user) {
    throw new AppError(401, "UNAUTHORIZED", "Socket user missing.");
  }

  return socket.user;
}
