// Tracks connected players per game session so the UI can show live presence.
const sessionPresence = new Map<string, Set<string>>();
const socketSessions = new Map<string, { sessionId: string; userId: string }>();

export function registerSocketPresence(socketId: string, sessionId: string, userId: string) {
  socketSessions.set(socketId, { sessionId, userId });

  const users = sessionPresence.get(sessionId) ?? new Set<string>();
  users.add(userId);
  sessionPresence.set(sessionId, users);
}

export function removeSocketPresence(socketId: string) {
  const presence = socketSessions.get(socketId);
  if (!presence) {
    return;
  }

  socketSessions.delete(socketId);
  const users = sessionPresence.get(presence.sessionId);

  if (!users) {
    return;
  }

  users.delete(presence.userId);
  if (users.size === 0) {
    sessionPresence.delete(presence.sessionId);
  }
}

export function getOnlineUserIds(sessionId: string) {
  return Array.from(sessionPresence.get(sessionId) ?? []);
}

export function clearPresence() {
  sessionPresence.clear();
  socketSessions.clear();
}
