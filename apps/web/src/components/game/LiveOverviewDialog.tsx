import { AnimatePresence, motion } from "framer-motion";
import type { LivePlayerOverview } from "@takeshi-castle/shared";

type LiveOverviewDialogProps = {
  open: boolean;
  onClose: () => void;
  players: LivePlayerOverview[];
};

function positionLabel(player: LivePlayerOverview) {
  if (!player.averagePosition) {
    return "No claimed zone yet";
  }

  return `R${player.averagePosition.rowIndex} · C${player.averagePosition.colIndex}`;
}

export function LiveOverviewDialog({ open, onClose, players }: LiveOverviewDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#183a33]/20 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-5xl rounded-[2.5rem] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-soft)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Live Overview</p>
                <h3 className="text-3xl font-semibold text-[var(--text-strong)]">Player control map</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm text-[var(--text-body)] transition hover:border-[var(--accent-teal)] hover:text-[var(--text-strong)]"
              >
                Close
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-[1.7rem] border border-[var(--border-soft)] bg-[var(--bg-panel-alt)] px-5 py-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-strong)]">Live team summary</p>
                <p className="text-xs text-[var(--text-muted)]">Tiles, momentum, and average control position per player.</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-teal)]">
                {players.length} active rows
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {players.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[var(--border-soft)] bg-[var(--bg-panel-alt)] p-8 text-center text-[var(--text-muted)] sm:col-span-2">
                  No live player data yet.
                </div>
              ) : (
                players.map((player, index) => (
                  <motion.div
                    key={player.user.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="dashboard-card rounded-[2rem] p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full ring-4 ring-emerald-50"
                          style={{ backgroundColor: player.user.color }}
                        />
                        <div>
                          <p className="font-medium text-[var(--text-strong)]">{player.user.username}</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                            {player.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[var(--accent-lime-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-teal)]">
                        {player.tilesOwned} tiles
                      </span>
                    </div>

                    <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-[#dfeee8]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, player.tilesOwned * 8)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-mint)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-[var(--bg-panel-alt)] px-3 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Claims</p>
                        <p className="mt-1 text-base font-semibold text-[var(--text-strong)]">{player.totalClaims}</p>
                      </div>
                      <div className="rounded-2xl bg-[var(--bg-panel-alt)] px-3 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Position</p>
                        <p className="mt-1 text-base font-semibold text-[var(--text-strong)]">{positionLabel(player)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
