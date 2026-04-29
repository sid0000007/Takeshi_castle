// Responds to socket heartbeat pings so clients can detect a live connection.
import type { Socket } from "socket.io";

import { SOCKET_EVENTS } from "../../constants/events.js";

export function registerHeartbeatHandler(socket: Socket) {
  socket.on(SOCKET_EVENTS.ping, () => {
    socket.emit(SOCKET_EVENTS.pong);
  });
}
