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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#183a33]/20 px-4 py-10 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex max-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col rounded-[2.5rem] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-soft)]"
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

            <div className="min-h-0 flex-1 overflow-auto rounded-[2rem] border border-[var(--border-soft)] bg-white">
              {players.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  No live player data yet.
                </div>
              ) : (
                <table className="w-full border-separate border-spacing-0 text-left">
                  <thead className="sticky top-0 bg-[var(--bg-panel)]">
                    <tr className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      <th className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold">Player</th>
                      <th className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold">Status</th>
                      <th className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold">Tiles</th>
                      <th className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold">Claims</th>
                      <th className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <motion.tr
                        key={player.user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="text-sm text-[var(--text-body)]"
                      >
                        <td className="border-b border-[var(--border-soft)] px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-4 w-4 rounded-full ring-4 ring-emerald-50"
                              style={{ backgroundColor: player.user.color }}
                            />
                            <div>
                              <p className="font-semibold text-[var(--text-strong)]">{player.user.username}</p>
                              <p className="text-xs text-[var(--text-muted)]">{player.user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[var(--border-soft)] px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            player.isOnline
                              ? "bg-[#dff8f1] text-[var(--accent-teal)]"
                              : "bg-[var(--bg-panel-alt)] text-[var(--text-muted)]"
                          }`}>
                            {player.isOnline ? "Online" : "Offline"}
                          </span>
                        </td>
                        <td className="border-b border-[var(--border-soft)] px-6 py-4 font-semibold text-[var(--accent-teal-strong)]">
                          {player.tilesOwned}
                        </td>
                        <td className="border-b border-[var(--border-soft)] px-6 py-4">{player.totalClaims}</td>
                        <td className="border-b border-[var(--border-soft)] px-6 py-4 font-medium text-[var(--text-strong)]">
                          {positionLabel(player)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
