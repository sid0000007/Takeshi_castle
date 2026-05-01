type ZoomControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white px-2 py-2 shadow-sm">
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-sm text-[var(--text-body)] transition hover:border-[var(--accent-teal)]"
      >
        -
      </button>
      <span className="min-w-16 text-center text-sm font-medium text-[var(--text-strong)]">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        onClick={onZoomIn}
        className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-sm text-[var(--text-body)] transition hover:border-[var(--accent-teal)]"
      >
        +
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-sm text-[var(--text-body)] transition hover:border-[var(--accent-teal)]"
      >
        Reset
      </button>
    </div>
  );
}
