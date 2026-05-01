type ZoomControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2 py-2">
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-200 transition hover:border-white/30"
      >
        -
      </button>
      <span className="min-w-16 text-center text-sm text-stone-300">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        onClick={onZoomIn}
        className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-200 transition hover:border-white/30"
      >
        +
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-200 transition hover:border-white/30"
      >
        Reset
      </button>
    </div>
  );
}
