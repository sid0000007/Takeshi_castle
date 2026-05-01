// Authenticates socket connections and exposes the current socket user.
import type { Server, Socket } from "socket.io";

import { AppError } from "../../lib/http-error.js";
import { verifyToken } from "../../lib/jwt.js";
import { resolveAuthenticatedUser } from "../../modules/auth/auth.service.js";

export function attachConnectionAuth(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      next(new AppError(401, "UNAUTHORIZED", "Missing socket auth token."));
      return;
    }

    try {
      const auth = verifyToken(token);
      socket.auth = auth;
      socket.user = await resolveAuthenticatedUser(auth);
      socket.data.userRole = socket.user.role;
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
