// Tracks room membership changes and updates the online player count.
import type { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "../../constants/events.js";
import { getCurrentGameState } from "../../modules/game/game.service.js";
import { removeSocketPresence } from "../../services/presence.service.js";
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
    removeSocketPresence(socket.id);
    void emitOnlineUsers(io, sessionId);
    void getCurrentGameState().then((state) => {
      io.to(gameRoom(sessionId)).emit("players_updated", {
        players: state.players
      });
    });
  });
}
