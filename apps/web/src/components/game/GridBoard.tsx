import type { TileState } from "@takeshi-castle/shared";

import { Tile } from "./Tile.js";

type GridBoardProps = {
  tiles: TileState[];
  cols: number;
  currentUserId: string | null;
  zoom: number;
  onClaim: (tileId: string) => void;
};

export function GridBoard({ tiles, cols, currentUserId, zoom, onClaim }: GridBoardProps) {
  return (
    <div className="overflow-auto rounded-[2rem] border border-white/10 bg-black/20 p-3">
      <div
        className="grid gap-1 rounded-[1.65rem] border border-white/10 bg-black/30 p-3 shadow-2xl shadow-black/30 transition-transform duration-200"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: "fit-content"
        }}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            isCurrentUserOwner={tile.owner?.id === currentUserId}
            onClaim={onClaim}
          />
        ))}
      </div>
    </div>
  );
}
