export type TileCoordinate = {
  rowIndex: number;
  colIndex: number;
};

export type PublicUser = {
  id: string;
  email: string | null;
  username: string;
  color: string;
  role: "admin" | "player";
};

export type TileState = {
  id: string;
  sessionId: string;
  rowIndex: number;
  colIndex: number;
  owner: PublicUser | null;
  claimedAt: string | null;
  version: number;
};

export type GameSession = {
  id: string;
  name: string;
  status: "active" | "paused" | "ended";
  gridRows: number;
  gridCols: number;
};

export type GameState = {
  session: GameSession;
  tiles: TileState[];
  players: LivePlayerOverview[];
};

export type LeaderboardEntry = PublicUser & {
  totalClaims: number;
  tilesOwned: number;
  rank: number;
};

export type LivePlayerOverview = {
  user: PublicUser;
  totalClaims: number;
  tilesOwned: number;
  averagePosition: TileCoordinate | null;
  isOnline: boolean;
  lastClaimedAt: string | null;
};
