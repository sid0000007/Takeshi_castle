import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../features/auth/auth.store.js";

export function AppLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-white/10 bg-stone-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Takeshi Castle</p>
            <h1 className="text-lg font-semibold text-stone-50">Realtime Grid Arena</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-stone-300">
            <Link to="/game" className="hover:text-white">
              Game
            </Link>
            <Link to="/leaderboard" className="hover:text-white">
              Leaderboard
            </Link>
            {user ? (
              <button
                className="rounded-full border border-white/10 px-3 py-1 text-stone-100 hover:border-white/30"
                onClick={clearAuth}
                type="button"
              >
                {user.username}
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
