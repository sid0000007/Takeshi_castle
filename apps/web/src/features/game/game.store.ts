import { create } from "zustand";
import type { GameSession, LeaderboardEntry, LivePlayerOverview, TileState } from "@takeshi-castle/shared";

import type { ConnectionStatus } from "./game.types.js";

type GameStore = {
  session: GameSession | null;
  tiles: Record<string, TileState>;
  tileOrder: string[];
  players: LivePlayerOverview[];
  leaderboard: LeaderboardEntry[];
  onlineCount: number;
  claimError: string | null;
  connectionStatus: ConnectionStatus;
  setGameState: (payload: {
    session: GameSession;
    tiles: TileState[];
    players: LivePlayerOverview[];
  }) => void;
  updateTile: (tile: TileState) => void;
  setPlayers: (players: LivePlayerOverview[]) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setOnlineCount: (count: number) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setClaimError: (message: string | null) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  tiles: {},
  tileOrder: [],
  players: [],
  leaderboard: [],
  onlineCount: 0,
  claimError: null,
  connectionStatus: "idle",
  setGameState: ({ session, tiles, players }) => {
    const nextTiles = Object.fromEntries(tiles.map((tile) => [tile.id, tile]));
    set({
      session,
      tiles: nextTiles,
      tileOrder: tiles.map((tile) => tile.id),
      players
    });
  },
  updateTile: (tile) =>
    set((state) => ({
      tiles: {
        ...state.tiles,
        [tile.id]: tile
      }
    })),
  setPlayers: (players) => set({ players }),
  setLeaderboard: (entries) => set({ leaderboard: entries }),
  setOnlineCount: (count) => set({ onlineCount: count }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setClaimError: (claimError) => set({ claimError })
}));
