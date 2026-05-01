import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "../../features/auth/auth.store.js";

const navItems = [
  { label: "Dashboard", to: "/game", hint: "Live grid" },
  { label: "Players", to: "/leaderboard", hint: "Ownership" }
];

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <aside className="app-shell-panel fixed inset-y-0 left-0 hidden h-screen w-[280px] shrink-0 rounded-r-[2rem] border-l-0 border-t-0 border-b-0 bg-[var(--bg-sidebar)] px-5 py-6 lg:flex lg:flex-col lg:overflow-hidden">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-teal)] to-[var(--accent-lime)] text-lg font-bold text-white shadow-md">
          TC
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Draft Style</p>
          <h1 className="text-xl font-semibold text-[var(--text-strong)] sm:text-[1.7rem]">Takeshi Castle</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-[1.4rem] border px-4 py-3 transition ${
                  isActive
                    ? "border-transparent bg-[var(--accent-teal)] text-white shadow-lg shadow-emerald-900/10"
                    : "border-transparent text-[var(--text-body)] hover:border-[var(--border-soft)] hover:bg-white/70"
                }`
              }
            >
              <div>
                <p className="text-[0.95rem] font-medium">{item.label}</p>
                <p className="text-xs opacity-70">{item.hint}</p>
              </div>
              <span className="text-lg">›</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto space-y-4 rounded-[1.8rem] border border-[var(--border-soft)] bg-white/70 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Signed in</p>
          <p className="mt-2 text-base font-semibold text-[var(--text-strong)] sm:text-lg">{user?.username}</p>
          <p className="text-sm text-[var(--text-muted)]">{user?.email ?? "Local player"}</p>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-[var(--bg-panel-alt)] px-3 py-2">
          <span className="text-sm text-[var(--text-body)]">Role</span>
          <span className="rounded-full bg-[var(--accent-cream)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-teal-strong)]">
            {user?.role ?? "player"}
          </span>
        </div>

        <button
          type="button"
          onClick={clearAuth}
          className="w-full rounded-[1.2rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-sm font-medium text-[var(--text-strong)] transition hover:border-[var(--accent-teal)] hover:bg-[var(--bg-panel-alt)]"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
