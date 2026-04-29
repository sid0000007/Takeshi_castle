import type { LeaderboardEntry } from "@takeshi-castle/shared";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Top Players</span>
      </div>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-stone-400">No claims yet.</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <p className="font-medium text-white">{entry.username}</p>
                  <p className="text-xs text-stone-400">{entry.totalClaims} total claims</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-amber-300">{entry.tilesOwned}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
