import { AnimatePresence, motion } from "framer-motion";

export type ToastMessage = {
  id: string;
  tone: "info" | "error" | "success";
  text: string;
};

type ToastViewportProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-[70] flex w-full max-w-xl -translate-x-1/2 flex-col gap-3 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`pointer-events-auto rounded-[1.6rem] border px-5 py-4 shadow-[var(--shadow-card)] ${
              toast.tone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : toast.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-[var(--border-soft)] bg-[var(--bg-panel)] text-[var(--text-strong)]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{toast.text}</p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-70 transition hover:opacity-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
