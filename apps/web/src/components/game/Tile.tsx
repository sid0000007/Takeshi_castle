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

  const ownerInitials = owner
    ? owner.username
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "";

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
      className="group relative aspect-square min-w-0 overflow-hidden rounded-[1rem] border border-white/30 transition disabled:cursor-not-allowed"
      style={{
        background: owner
          ? isCurrentUserOwner
            ? `linear-gradient(180deg, ${owner.color}, color-mix(in srgb, ${owner.color} 72%, #fff5c0 28%))`
            : `linear-gradient(180deg, ${owner.color}, color-mix(in srgb, ${owner.color} 76%, #edf5dc 24%))`
          : "linear-gradient(180deg, rgba(241,243,234,0.78), rgba(228,232,224,0.92))"
      }}
    >
      <BombSplash active={showSplash} />
      <div
        className={`absolute inset-0 opacity-0 transition group-hover:opacity-100 ${
          owner ? "bg-white/10" : "bg-white/35"
        }`}
      />
      <div className="relative flex h-full w-full flex-col justify-between p-1.5 text-left">
        <div className="flex items-start justify-end gap-2">
          {owner ? (
            <span
              className={`rounded-full px-1.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] ${
                isCurrentUserOwner
                  ? "bg-[var(--accent-cream)] text-[var(--accent-teal-strong)]"
                  : "bg-white/70 text-[var(--accent-teal-strong)]"
              }`}
            >
              {isCurrentUserOwner ? "Yours" : "Owned"}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 items-center justify-center">
          {owner ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold tracking-[0.08em] text-white shadow-sm">
              {ownerInitials}
            </div>
          ) : (
            <div className="h-2.5 w-2.5 rounded-full bg-white/55 transition group-hover:scale-125 group-hover:bg-[var(--accent-lime)]" />
          )}
        </div>
      </div>
    </motion.button>
  );
}
