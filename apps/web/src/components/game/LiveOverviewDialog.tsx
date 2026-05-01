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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-stone-950/95 p-6 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Live Overview</p>
                <h3 className="text-2xl font-semibold text-white">Player control map</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-300 transition hover:border-white/30 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {players.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-stone-400 sm:col-span-2">
                  No live player data yet.
                </div>
              ) : (
                players.map((player, index) => (
                  <motion.div
                    key={player.user.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full ring-4 ring-white/5"
                          style={{ backgroundColor: player.user.color }}
                        />
                        <div>
                          <p className="font-medium text-white">{player.user.username}</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                            {player.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-300">
                        {player.tilesOwned} tiles
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-2xl bg-black/20 px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Claims</p>
                        <p className="mt-1 text-base font-semibold text-white">{player.totalClaims}</p>
                      </div>
                      <div className="rounded-2xl bg-black/20 px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Position</p>
                        <p className="mt-1 text-base font-semibold text-white">{positionLabel(player)}</p>
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
