import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { GridBoard } from "../components/game/GridBoard.js";
import { Leaderboard } from "../components/stats/Leaderboard.js";
import { fetchGameState, fetchLeaderboard } from "../features/game/game.api.js";
import { useClaimTile } from "../features/game/useClaimTile.js";
import { useGameSocket } from "../features/game/useGameSocket.js";
import { useGameStore } from "../features/game/game.store.js";

export function GamePage() {
  const setGameState = useGameStore((state) => state.setGameState);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const session = useGameStore((state) => state.session);
  const tileOrder = useGameStore((state) => state.tileOrder);
  const tilesById = useGameStore((state) => state.tiles);
  const leaderboard = useGameStore((state) => state.leaderboard);
  const onlineCount = useGameStore((state) => state.onlineCount);
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const claimError = useGameStore((state) => state.claimError);
  const claimTile = useClaimTile();

  const gameQuery = useQuery({
    queryKey: ["game-state"],
    queryFn: fetchGameState
  });

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard
  });

  useEffect(() => {
    if (gameQuery.data) {
      setGameState(gameQuery.data);
    }
  }, [gameQuery.data, setGameState]);

  useEffect(() => {
    if (leaderboardQuery.data) {
      setLeaderboard(leaderboardQuery.data.entries);
    }
  }, [leaderboardQuery.data, setLeaderboard]);

  useGameSocket();

  const tiles = tileOrder
    .map((tileId) => tilesById[tileId])
    .filter((tile): tile is NonNullable<typeof tile> => Boolean(tile));
  const claimedTiles = tiles.filter((tile) => tile.owner).length;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Live Match</p>
            <h2 className="text-2xl font-semibold text-white">{session?.name ?? "Loading..."}</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-stone-300">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {claimedTiles} claimed
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              {onlineCount} online
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>

        {claimError ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {claimError}
          </div>
        ) : null}

        {gameQuery.isLoading && !tiles.length ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-300">
            Loading game board...
          </div>
        ) : session ? (
          <GridBoard tiles={tiles} cols={session.gridCols} onClaim={claimTile} />
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-300">
            Could not load the active game session.
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <Leaderboard entries={leaderboard} />
      </aside>
    </div>
  );
}
