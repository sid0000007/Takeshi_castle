// Processes incoming claim events and broadcasts the result to players.
import type { Server, Socket } from "socket.io";
import type { ClaimFailedPayload, ClaimTilePayload } from "@takeshi-castle/shared";

import { SOCKET_EVENTS } from "../../constants/events.js";
import { AppError } from "../../lib/http-error.js";
import { claimTileForUser } from "../../modules/tiles/tiles.service.js";
import { requireSocketUser } from "./connection.js";

export function registerClaimTileHandler(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.claimTile, async (payload: ClaimTilePayload) => {
    try {
      const user = requireSocketUser(socket);
      const result = await claimTileForUser(payload.tileId, user);

      io.emit(SOCKET_EVENTS.tileUpdated, result.tile);
      io.emit("players_updated", {
        players: result.gameState.players
      });
      io.emit(SOCKET_EVENTS.leaderboardUpdated, {
        entries: result.leaderboard
      });
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : "Could not claim tile right now.";
      const claimFailed: ClaimFailedPayload = {
        tileId: payload.tileId,
        reason: message
      };

      socket.emit(SOCKET_EVENTS.claimFailed, claimFailed);
    }
  });
}
