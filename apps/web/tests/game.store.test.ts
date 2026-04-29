import { describe, expect, it } from "vitest";

import { useGameStore } from "../src/features/game/game.store.js";

describe("game store", () => {
  it("applies incoming tile updates", () => {
    useGameStore.setState({
      session: {
        id: "session-1",
        name: "Season 1",
        status: "active",
        gridRows: 20,
        gridCols: 20
      },
      tileOrder: ["tile-1"],
      tiles: {
        "tile-1": {
          id: "tile-1",
          sessionId: "session-1",
          rowIndex: 0,
          colIndex: 0,
          claimedAt: null,
          version: 0,
          owner: null
        }
      },
      leaderboard: [],
      onlineCount: 0,
      claimError: null,
      connectionStatus: "idle"
    });

    useGameStore.getState().updateTile({
      id: "tile-1",
      sessionId: "session-1",
      rowIndex: 0,
      colIndex: 0,
      claimedAt: new Date().toISOString(),
      version: 1,
      owner: {
        id: "user-1",
        username: "Sid",
        color: "#22c55e"
      }
    });

    expect(useGameStore.getState().tiles["tile-1"]?.owner?.username).toBe("Sid");
    expect(useGameStore.getState().tiles["tile-1"]?.version).toBe(1);
  });
});
