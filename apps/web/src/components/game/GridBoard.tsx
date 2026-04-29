import type { TileState } from "@takeshi-castle/shared";

import { Tile } from "./Tile.js";

type GridBoardProps = {
  tiles: TileState[];
  cols: number;
  onClaim: (tileId: string) => void;
};

export function GridBoard({ tiles, cols, onClaim }: GridBoardProps) {
  return (
    <div
      className="grid gap-1 rounded-[2rem] border border-white/10 bg-black/30 p-3 shadow-2xl shadow-black/30"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} onClaim={onClaim} />
      ))}
    </div>
  );
}
