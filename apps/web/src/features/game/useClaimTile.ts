import { useGameStore } from "./game.store.js";
import { useAuthStore } from "../auth/auth.store.js";
import { getSocket } from "../../services/socket.js";

export function useClaimTile() {
  const token = useAuthStore((state) => state.token);
  const setClaimError = useGameStore((state) => state.setClaimError);

  return (tileId: string) => {
    if (!token) {
      return;
    }

    setClaimError(null);
    const socket = getSocket(token);
    socket.emit("claim_tile", { tileId });
  };
}
