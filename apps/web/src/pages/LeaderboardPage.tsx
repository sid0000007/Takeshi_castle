import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Leaderboard } from "../components/stats/Leaderboard.js";
import { fetchLeaderboard } from "../features/game/game.api.js";
import { useGameStore } from "../features/game/game.store.js";

export function LeaderboardPage() {
  const entries = useGameStore((state) => state.leaderboard);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard-page"],
    queryFn: fetchLeaderboard
  });

  useEffect(() => {
    if (leaderboardQuery.data) {
      setLeaderboard(leaderboardQuery.data.entries);
    }
  }, [leaderboardQuery.data, setLeaderboard]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Leaderboard entries={entries} />
    </div>
  );
}
