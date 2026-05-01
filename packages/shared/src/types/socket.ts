import type { GameState, LeaderboardEntry, LivePlayerOverview, TileState } from "./game.js";

export type JoinGamePayload = {
  sessionId: string;
};

export type ClaimTilePayload = {
  tileId: string;
};

export type ClaimFailedPayload = {
  tileId: string;
  reason: string;
};

export type OnlineUsersPayload = {
  count: number;
};

export type AuthRevokedPayload = {
  reason: string;
};

export type ServerToClientEvents = {
  game_state: (payload: GameState) => void;
  players_updated: (payload: { players: LivePlayerOverview[] }) => void;
  tile_updated: (payload: TileState) => void;
  claim_failed: (payload: ClaimFailedPayload) => void;
  leaderboard_updated: (payload: { entries: LeaderboardEntry[] }) => void;
  online_users: (payload: OnlineUsersPayload) => void;
  auth_revoked: (payload: AuthRevokedPayload) => void;
  game_reset: () => void;
  pong: () => void;
};

export type ClientToServerEvents = {
  join_game: (payload: JoinGamePayload) => void;
  claim_tile: (payload: ClaimTilePayload) => void;
  ping: () => void;
};
