// Shapes leaderboard data for API and socket responses.
import { getLeaderboard } from "./leaderboard.repository.js";

export async function listLeaderboard() {
  return {
    entries: await getLeaderboard()
  };
}
