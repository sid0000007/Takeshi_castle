import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { GridBoard } from "../components/game/GridBoard.js";
import { LiveOverviewDialog } from "../components/game/LiveOverviewDialog.js";
import { ZoomControls } from "../components/game/ZoomControls.js";
import { Leaderboard } from "../components/stats/Leaderboard.js";
import { fetchGameState, fetchLeaderboard } from "../features/game/game.api.js";
import { resetGame } from "../features/game/game.api.js";
import { useAuthStore } from "../features/auth/auth.store.js";
import { useClaimTile } from "../features/game/useClaimTile.js";
import { useGameSocket } from "../features/game/useGameSocket.js";
import { useGameStore } from "../features/game/game.store.js";

export function GamePage() {
  const setGameState = useGameStore((state) => state.setGameState);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const session = useGameStore((state) => state.session);
  const tileOrder = useGameStore((state) => state.tileOrder);
  const tilesById = useGameStore((state) => state.tiles);
  const players = useGameStore((state) => state.players);
  const leaderboard = useGameStore((state) => state.leaderboard);
  const onlineCount = useGameStore((state) => state.onlineCount);
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const claimError = useGameStore((state) => state.claimError);
  const user = useAuthStore((state) => state.user);
  const claimTile = useClaimTile();
  const [zoom, setZoom] = useState(1);
  const [overviewOpen, setOverviewOpen] = useState(false);

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
  const myTiles = tiles.filter((tile) => tile.owner?.id === user?.id).length;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Live Match</p>
            <h2 className="text-2xl font-semibold text-white">{session?.name ?? "Loading..."}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-300">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {claimedTiles} claimed
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              {myTiles} yours
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              {onlineCount} online
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 capitalize">
              {connectionStatus}
            </span>
            <button
              type="button"
              onClick={() => setOverviewOpen(true)}
              className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-amber-200 transition hover:bg-amber-400/20"
            >
              Live overview
            </button>
            {user?.role === "admin" ? (
              <button
                type="button"
                onClick={() => {
                  void resetGame();
                }}
                className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1 text-rose-200 transition hover:bg-rose-500/20"
              >
                Reset game
              </button>
            ) : null}
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Board controls</p>
            <p className="text-xs text-stone-400">Zoom for larger maps and scroll to pan across the grid.</p>
          </div>
          <ZoomControls
            zoom={zoom}
            onZoomIn={() => setZoom((value) => Math.min(2, Number((value + 0.1).toFixed(2))))}
            onZoomOut={() => setZoom((value) => Math.max(0.7, Number((value - 0.1).toFixed(2))))}
            onReset={() => setZoom(1)}
          />
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
          <GridBoard
            tiles={tiles}
            cols={session.gridCols}
            currentUserId={user?.id ?? null}
            zoom={zoom}
            onClaim={claimTile}
          />
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-300">
            Could not load the active game session.
          </div>
        )}

        <LiveOverviewDialog
          open={overviewOpen}
          onClose={() => setOverviewOpen(false)}
          players={players}
        />
      </section>

      <aside className="space-y-4">
        <Leaderboard entries={leaderboard} />
      </aside>
    </div>
  );
}
