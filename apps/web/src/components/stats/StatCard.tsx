import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  accent?: "teal" | "mint" | "warm";
  delay?: number;
};

export function StatCard({ label, value, hint, accent = "teal", delay = 0 }: StatCardProps) {
  const accentClasses =
    accent === "warm"
      ? "bg-[var(--accent-cream)] text-[var(--accent-teal-strong)]"
      : accent === "mint"
        ? "bg-[#dff8f1] text-[var(--accent-teal)]"
        : "bg-[#dcefeb] text-[var(--accent-teal)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="dashboard-card rounded-[2rem] p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-[2.7rem]">{value}</p>
        </div>
        <span className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${accentClasses}`}>
          live
        </span>
      </div>
      <p className="text-sm text-[var(--text-body)]">{hint}</p>
    </motion.div>
  );
}
