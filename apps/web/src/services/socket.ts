import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@takeshi-castle/shared";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let socketToken: string | null = null;

export function getSocket(token: string) {
  if (socket && socketToken !== token) {
    socket.disconnect();
    socket = null;
    socketToken = null;
  }

  if (socket) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: false,
    auth: {
      token
    }
  });
  socketToken = token;

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
  socketToken = null;
}
