// Creates the Socket.IO server and wires all realtime event handlers.
import type { Server as HttpServer } from "node:http";

import { Server } from "socket.io";

import { socketConfig } from "../config/socket.js";
import { SOCKET_EVENTS } from "../constants/events.js";
import { getCurrentGameState } from "../modules/game/game.service.js";
import { clearPresence, registerSocketPresence } from "../services/presence.service.js";
import { attachConnectionAuth } from "./handlers/connection.js";
import { registerClaimTileHandler } from "./handlers/claim-tile.js";
import { registerDisconnectHandler, emitOnlineUsers } from "./handlers/disconnect.js";
import { registerHeartbeatHandler } from "./handlers/heartbeat.js";
import { gameRoom } from "./rooms/game.room.js";

let ioInstance: Server | null = null;

export function bootstrapSockets(server: HttpServer) {
  const io = new Server(server, socketConfig);
  ioInstance = io;
  attachConnectionAuth(io);

  io.on("connection", (socket) => {
    registerHeartbeatHandler(socket);
    registerClaimTileHandler(io, socket);

    socket.on(SOCKET_EVENTS.joinGame, async ({ sessionId }) => {
      socket.join(gameRoom(sessionId));
      registerSocketPresence(socket.id, sessionId, socket.user!.id);

      const state = await getCurrentGameState();
      socket.emit(SOCKET_EVENTS.gameState, state);
      io.to(gameRoom(sessionId)).emit("players_updated", {
        players: state.players
      });
      await emitOnlineUsers(io, sessionId);
      registerDisconnectHandler(io, socket, sessionId);
    });
  });

  return io;
}

export function getSocketServer() {
  return ioInstance;
}

export async function revokeNonAdminSockets(reason: string) {
  if (!ioInstance) {
    return;
  }

  const sockets = await ioInstance.fetchSockets();

  for (const socket of sockets) {
    if (socket.data.userRole !== "admin") {
      socket.emit("auth_revoked", { reason });
      socket.disconnect(true);
    }
  }

  clearPresence();
}
