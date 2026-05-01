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
    <div className="dashboard-card overflow-auto rounded-[2.2rem] p-4">
      <div
        className="grid gap-1.5 rounded-[1.9rem] border border-[#d1ddd5] bg-[#c7c8c2] p-4 shadow-inner transition-transform duration-200"
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
