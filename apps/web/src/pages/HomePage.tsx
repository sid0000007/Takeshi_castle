import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "../features/auth/auth.store.js";
import { useLogin, useRegister } from "../features/auth/useAuthMutations.js";

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
const featureCards = [
  {
    title: "Capture",
    body: "Claim tiles live with server-authoritative ownership and smooth feedback."
  },
  {
    title: "Sync",
    body: "Follow every move through realtime multiplayer updates and live player status."
  },
  {
    title: "Control",
    body: "Reset sessions, review control zones, and manage the board like a polished live ops surface."
  }
];

type Mode = "login" | "register";

export function HomePage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const login = useLogin();
  const register = useRegister();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [color, setColor] = useState(colors[3] ?? "#22c55e");

  if (token) {
    return <Navigate to="/game" replace />;
  }

  const errorMessage = (mode === "login" ? login.error : register.error)?.message ?? null;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1500px] overflow-hidden rounded-[2.4rem] border border-[var(--border-soft)] bg-[var(--bg-panel)] shadow-[var(--shadow-soft)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[var(--accent-teal)] to-[var(--accent-lime)] text-xl font-bold text-white shadow-lg shadow-emerald-900/10">
                TC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Live Grid Control</p>
                <h1 className="text-4xl font-semibold text-[var(--text-strong)]">Takeshi Castle</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--text-strong)]">
                {mode === "login" ? "Login to your account" : "Create your player profile"}
              </h2>
              <p className="mt-3 text-base text-[var(--text-muted)]">
                Clean access to a live multiplayer board with ownership tracking, admin controls, and realtime sync.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-2 rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel-alt)] p-1">
              {(["login", "register"] as const).map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setMode(entry)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    mode === entry
                      ? "teal-button"
                      : "text-[var(--text-body)] hover:bg-white/80"
                  }`}
                >
                  {entry === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                if (mode === "login") {
                  login.mutate(
                    { email, password },
                    {
                      onSuccess: () => navigate("/game")
                    }
                  );
                  return;
                }

                register.mutate(
                  { email, password, username, color },
                  {
                    onSuccess: () => navigate("/game")
                  }
                );
              }}
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-body)]" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-teal)] focus:ring-4 focus:ring-emerald-100"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {mode === "register" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-body)]" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-teal)] focus:ring-4 focus:ring-emerald-100"
                    placeholder="Your public display name"
                    maxLength={30}
                    required
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-body)]" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-teal)] focus:ring-4 focus:ring-emerald-100"
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              {mode === "register" ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[var(--text-body)]">Player color</p>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        className={`h-11 w-11 rounded-full border-[3px] shadow-sm transition ${
                          color === swatch
                            ? "border-[var(--text-strong)] scale-105"
                            : "border-white"
                        }`}
                        style={{ backgroundColor: swatch }}
                        onClick={() => setColor(swatch)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-[1.1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={login.isPending || register.isPending}
                className="teal-button w-full rounded-[1.25rem] px-4 py-3 font-semibold transition hover:translate-y-[-1px] disabled:opacity-70"
              >
                {mode === "login"
                  ? login.isPending
                    ? "Signing in..."
                    : "Sign in"
                  : register.isPending
                    ? "Creating account..."
                    : "Create account"}
              </button>
            </form>
          </motion.div>
        </section>

        <section className="app-hero-surface relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-12">
          <div className="absolute left-[-10%] top-[16%] h-72 w-72 rounded-full border border-white/35" />
          <div className="absolute right-[-8%] top-[8%] h-80 w-80 rounded-full border border-white/20" />
          <div className="absolute bottom-[-10%] right-[8%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.35em] text-white/75">Realtime Multiplayer Workspace</p>
            <h3 className="mt-4 max-w-xl text-5xl font-semibold leading-tight">
              Capture, review, and manage the grid in one place.
            </h3>
            <p className="mt-5 max-w-lg text-lg text-white/82">
              The board, the players, and the control surface all share one consistent live view.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.08 }}
                className={`rounded-[2rem] border border-white/20 px-6 py-6 shadow-xl backdrop-blur ${
                  index === 1
                    ? "ml-auto w-[82%] bg-white/12"
                    : index === 2
                      ? "w-[88%] bg-white/10"
                      : "w-[78%] bg-white/14"
                }`}
              >
                <div className="mb-4 inline-flex rounded-full bg-white/18 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]">
                  {card.title}
                </div>
                <p className="max-w-sm text-lg leading-relaxed text-white/88">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
