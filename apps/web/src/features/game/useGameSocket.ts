import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../auth/auth.store.js";
import { useGameStore } from "./game.store.js";
import { getSocket } from "../../services/socket.js";

export function useGameSocket() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const session = useGameStore((state) => state.session);
  const setGameState = useGameStore((state) => state.setGameState);
  const updateTile = useGameStore((state) => state.updateTile);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const setOnlineCount = useGameStore((state) => state.setOnlineCount);
  const setConnectionStatus = useGameStore((state) => state.setConnectionStatus);
  const setClaimError = useGameStore((state) => state.setClaimError);

  useEffect(() => {
    if (!token || !session) {
      return;
    }

    const socket = getSocket(token);
    setConnectionStatus("connecting");

    socket.on("connect", () => {
      setConnectionStatus("connected");
      socket.emit("join_game", { sessionId: session.id });
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("game_state", (payload) => {
      setGameState(payload);
    });

    socket.on("players_updated", (payload) => {
      setPlayers(payload.players);
    });

    socket.on("tile_updated", (payload) => {
      updateTile(payload);
      setClaimError(null);
    });

    socket.on("leaderboard_updated", (payload) => {
      setLeaderboard(payload.entries);
    });

    socket.on("online_users", (payload) => {
      setOnlineCount(payload.count);
    });

    socket.on("claim_failed", (payload) => {
      setClaimError(payload.reason);
    });

    socket.on("game_reset", () => {
      setClaimError("The game was reset by an admin.");
    });

    socket.on("auth_revoked", () => {
      clearAuth();
      navigate("/");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("game_state");
      socket.off("players_updated");
      socket.off("tile_updated");
      socket.off("leaderboard_updated");
      socket.off("online_users");
      socket.off("claim_failed");
      socket.off("game_reset");
      socket.off("auth_revoked");
    };
  }, [
    clearAuth,
    navigate,
    token,
    session,
    setClaimError,
    setConnectionStatus,
    setGameState,
    setLeaderboard,
    setOnlineCount,
    setPlayers,
    updateTile
  ]);
}
