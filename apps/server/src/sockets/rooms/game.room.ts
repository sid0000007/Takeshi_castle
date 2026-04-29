// Builds the room name used to group players by active game session.
import { GAME_ROOM_PREFIX } from "../../constants/game.js";

export function gameRoom(sessionId: string) {
  return `${GAME_ROOM_PREFIX}${sessionId}`;
}
