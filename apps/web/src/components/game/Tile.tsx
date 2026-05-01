import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TileState } from "@takeshi-castle/shared";

import { BombSplash } from "./BombSplash.js";

type TileProps = {
  tile: TileState;
  isCurrentUserOwner: boolean;
  onClaim: (tileId: string) => void;
};

export function Tile({ tile, isCurrentUserOwner, onClaim }: TileProps) {
  const owner = tile.owner;
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setShowSplash(false);
    }, 520);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [showSplash]);

  function handleClick() {
    if (owner) {
      return;
    }

    setShowSplash(false);
    window.requestAnimationFrame(() => {
      setShowSplash(true);
    });
    onClaim(tile.id);
  }

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      type="button"
      onClick={handleClick}
      disabled={Boolean(owner)}
      className="group relative aspect-square min-w-0 overflow-hidden rounded-xl border border-white/10 transition disabled:cursor-not-allowed"
      style={{
        background: owner
          ? `linear-gradient(160deg, ${owner.color}, rgba(10,10,10,0.9))`
          : "linear-gradient(160deg, rgba(245,158,11,0.08), rgba(255,255,255,0.02))"
      }}
    >
      <BombSplash active={showSplash} />
      <div
        className={`absolute inset-0 opacity-0 transition group-hover:opacity-100 ${
          owner ? "bg-black/10" : "bg-amber-300/5"
        }`}
      />
      <div className="relative flex h-full w-full flex-col justify-between p-2 text-left">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
            {tile.rowIndex},{tile.colIndex}
          </span>
          {owner ? (
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isCurrentUserOwner ? "bg-black/45 text-amber-200" : "bg-black/35 text-white/80"
              }`}
            >
              {isCurrentUserOwner ? "Yours" : "Owned"}
            </span>
          ) : null}
        </div>
        <div className="space-y-1">
          <span className="line-clamp-2 text-xs font-medium text-white">
            {owner ? owner.username : ""}
          </span>
          <span className="block text-[10px] uppercase tracking-[0.24em] text-white/60">
            {owner ? "Claimed" : ""}
          </span>
        </div>
        {owner ? (
          <span className="absolute bottom-2 right-2 text-[11px] font-semibold text-white/85">
            {owner.username.slice(0, 2).toUpperCase()}
          </span>
        ) : null}
      </div>
    </motion.button>
  );
}
