import type { LeaderboardEntry } from "@takeshi-castle/shared";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="dashboard-card rounded-[2rem] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)]">Players</p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)] sm:text-[1.85rem]">Leaderboard</h2>
        </div>
        <span className="rounded-full bg-[var(--bg-panel-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-teal)]">
          Top control
        </span>
      </div>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="rounded-[1.4rem] bg-[var(--bg-panel-alt)] px-4 py-5 text-sm text-[var(--text-muted)]">
            No claims yet.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white/80 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-4 ring-emerald-50"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div>
                    <p className="font-medium text-[var(--text-strong)]">{entry.username}</p>
                    <p className="text-xs text-[var(--text-muted)]">{entry.totalClaims} total claims</p>
                  </div>
                </div>
                <div>
                  <p className="text-right text-sm font-semibold text-[var(--accent-teal)]">{entry.tilesOwned}</p>
                  <p className="text-xs text-[var(--text-muted)]">tiles owned</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
