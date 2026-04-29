// Lists the socket event names used by the realtime game flow.
export const SOCKET_EVENTS = {
  claimFailed: "claim_failed",
  claimTile: "claim_tile",
  gameState: "game_state",
  joinGame: "join_game",
  leaderboardUpdated: "leaderboard_updated",
  onlineUsers: "online_users",
  ping: "ping",
  pong: "pong",
  tileUpdated: "tile_updated"
} as const;
