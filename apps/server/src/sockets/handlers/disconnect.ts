// Tracks room membership changes and updates the online player count.
import type { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "../../constants/events.js";
import { gameRoom } from "../rooms/game.room.js";

export async function emitOnlineUsers(io: Server, sessionId: string) {
  const room = gameRoom(sessionId);
  const sockets = await io.in(room).fetchSockets();
  io.to(room).emit(SOCKET_EVENTS.onlineUsers, {
    count: sockets.length
  });
}

export function registerDisconnectHandler(io: Server, socket: Socket, sessionId: string) {
  socket.on("disconnect", () => {
    void emitOnlineUsers(io, sessionId);
  });
}
