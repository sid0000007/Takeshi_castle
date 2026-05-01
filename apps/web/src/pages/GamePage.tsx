import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { ConfirmDialog } from "../components/common/ConfirmDialog.js";
import { ToastViewport, type ToastMessage } from "../components/common/ToastViewport.js";
import { GridBoard } from "../components/game/GridBoard.js";
import { LiveOverviewDialog } from "../components/game/LiveOverviewDialog.js";
import { ZoomControls } from "../components/game/ZoomControls.js";
import { Leaderboard } from "../components/stats/Leaderboard.js";
import { StatCard } from "../components/stats/StatCard.js";
import { fetchGameState, fetchLeaderboard } from "../features/game/game.api.js";
import { resetGame } from "../features/game/game.api.js";
import { useAuthStore } from "../features/auth/auth.store.js";
import { useClaimTile } from "../features/game/useClaimTile.js";
import { useGameSocket } from "../features/game/useGameSocket.js";
import { useGameStore } from "../features/game/game.store.js";

export function GamePage() {
  const setGameState = useGameStore((state) => state.setGameState);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const setClaimError = useGameStore((state) => state.setClaimError);
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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  useEffect(() => {
    if (!claimError) {
      return;
    }

    const nextToast: ToastMessage = {
      id: crypto.randomUUID(),
      tone: "error",
      text: claimError
    };

    setToasts((current) => [...current, nextToast]);
    setClaimError(null);
  }, [claimError, setClaimError]);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toasts]);

  useGameSocket();

  const tiles = tileOrder
    .map((tileId) => tilesById[tileId])
    .filter((tile): tile is NonNullable<typeof tile> => Boolean(tile));
  const claimedTiles = tiles.filter((tile) => tile.owner).length;
  const myTiles = tiles.filter((tile) => tile.owner?.id === user?.id).length;
  const leadingPlayer = players[0]?.user.username ?? "No leader";

  async function handleResetGame() {
    await resetGame();
    setResetDialogOpen(false);
    setToasts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        tone: "success",
        text: "Game reset triggered successfully."
      }
    ]);
  }

  return (
    <div className="space-y-6">
      <ToastViewport
        toasts={toasts}
        onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-hero-surface relative overflow-hidden rounded-[2.4rem] px-6 py-7 sm:px-8 lg:px-10"
      >
        <div className="absolute right-[-4%] top-[-18%] h-64 w-64 rounded-full border border-white/25" />
        <div className="absolute right-[12%] top-[10%] h-48 w-48 rounded-full border border-white/20" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                Live grid
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {session?.name ?? "Loading board"}
            </h1>
            <p className="mt-3 text-base text-white/82 sm:text-lg">
              {onlineCount} players online · {claimedTiles} claimed tiles · control view in sync
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <button
              type="button"
              onClick={() => setOverviewOpen(true)}
              className="soft-pill rounded-full px-5 py-3 text-sm font-semibold text-[var(--accent-teal-strong)] transition hover:bg-white"
            >
              Live overview
            </button>
            {user?.role === "admin" ? (
              <button
                type="button"
                onClick={() => setResetDialogOpen(true)}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                Reset game
              </button>
            ) : null}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Claimed" value={String(claimedTiles)} hint="Tiles already controlled on the board." delay={0.02} />
        <StatCard label="Online" value={String(onlineCount)} hint="Players connected to the live game room." accent="mint" delay={0.06} />
        <StatCard label="My tiles" value={String(myTiles)} hint="Tiles currently owned by your account." accent="warm" delay={0.1} />
        <StatCard label="Leader" value={leadingPlayer} hint="Current top owner based on live control." delay={0.14} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4">
        <div className="dashboard-card rounded-[2rem] px-5 py-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-strong)]">Grid</p>
            <p className="text-xs text-[var(--text-muted)]">Zoom for larger maps and scroll to pan across the grid.</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span className="rounded-full bg-[var(--bg-panel-alt)] px-3 py-2">Open target</span>
              <span className="rounded-full bg-[var(--accent-lime-soft)] px-3 py-2 text-[var(--accent-teal)]">Owned by player</span>
              <span className="rounded-full bg-[var(--accent-cream)] px-3 py-2 text-[var(--accent-teal-strong)]">Owned by you</span>
            </div>
            <ZoomControls
              zoom={zoom}
              onZoomIn={() => setZoom((value) => Math.min(2, Number((value + 0.1).toFixed(2))))}
              onZoomOut={() => setZoom((value) => Math.max(0.7, Number((value - 0.1).toFixed(2))))}
              onReset={() => setZoom(1)}
            />
          </div>
        </div>

        {gameQuery.isLoading && !tiles.length ? (
          <div className="dashboard-card rounded-[2rem] p-8 text-[var(--text-muted)]">
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
          <div className="dashboard-card rounded-[2rem] p-8 text-[var(--text-muted)]">
            Could not load the active game session.
          </div>
        )}

        <LiveOverviewDialog
          open={overviewOpen}
          onClose={() => setOverviewOpen(false)}
          players={players}
        />
        <ConfirmDialog
          open={resetDialogOpen}
          title="Reset the game board?"
          description="This will clear all tile ownership, reset player stats, and sign out non-admin players. This action is intentionally disruptive."
          confirmLabel="Reset game"
          tone="danger"
          onCancel={() => setResetDialogOpen(false)}
          onConfirm={() => {
            void handleResetGame();
          }}
        />
      </section>

      <aside className="space-y-4">
        <Leaderboard entries={leaderboard} />
      </aside>
      </div>
    </div>
  );
}
