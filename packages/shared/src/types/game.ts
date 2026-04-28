export type TileCoordinate = {
  rowIndex: number;
  colIndex: number;
};

export type PublicUser = {
  id: string;
  username: string;
  color: string;
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
};

export type LeaderboardEntry = PublicUser & {
  totalClaims: number;
  tilesOwned: number;
  rank: number;
};
