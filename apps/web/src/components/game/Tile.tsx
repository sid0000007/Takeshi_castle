import { motion } from "framer-motion";
import type { TileState } from "@takeshi-castle/shared";

type TileProps = {
  tile: TileState;
  onClaim: (tileId: string) => void;
};

export function Tile({ tile, onClaim }: TileProps) {
  const owner = tile.owner;

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      type="button"
      onClick={() => onClaim(tile.id)}
      disabled={Boolean(owner)}
      className="group aspect-square min-w-0 overflow-hidden rounded-xl border border-white/10 transition disabled:cursor-not-allowed"
      style={{
        background: owner
          ? `linear-gradient(160deg, ${owner.color}, rgba(10,10,10,0.9))`
          : "linear-gradient(160deg, rgba(245,158,11,0.08), rgba(255,255,255,0.02))"
      }}
    >
      <div className="flex h-full w-full flex-col justify-between p-2 text-left">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
          {tile.rowIndex},{tile.colIndex}
        </span>
        <span className="line-clamp-2 text-xs font-medium text-white">
          {owner ? owner.username : "Open"}
        </span>
      </div>
    </motion.button>
  );
}
