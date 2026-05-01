import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "../features/auth/auth.store.js";
import { useLogin, useRegister } from "../features/auth/useAuthMutations.js";

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

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

  const errorMessage =
    (mode === "login" ? login.error : register.error)?.message ?? null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_35%),linear-gradient(180deg,#111012_0%,#09090b_100%)] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur"
      >
        <div className="mb-6 space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Takeshi Castle</p>
          <h1 className="text-3xl font-semibold text-white">Enter the grid</h1>
          <p className="text-sm text-stone-400">
            Simple account access, fast board entry, live multiplayer state.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-full border border-white/10 bg-black/20 p-1">
          {(["login", "register"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setMode(entry)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === entry ? "bg-amber-400 text-stone-950" : "text-stone-300"
              }`}
            >
              {entry === "login" ? "Login" : "Register"}
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
          <div>
            <label className="mb-2 block text-sm text-stone-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-amber-400"
              placeholder="name@example.com"
              required
            />
          </div>

          {mode === "register" ? (
            <div>
              <label className="mb-2 block text-sm text-stone-300" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-amber-400"
                placeholder="Choose your display name"
                maxLength={30}
                required
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm text-stone-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-amber-400"
              placeholder="At least 8 characters"
              required
            />
          </div>

          {mode === "register" ? (
            <div>
              <p className="mb-3 text-sm text-stone-300">Player color</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    className={`h-10 w-10 rounded-full border-2 ${
                      color === swatch ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: swatch }}
                    onClick={() => setColor(swatch)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={login.isPending || register.isPending}
            className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-stone-950 transition hover:bg-amber-300 disabled:opacity-70"
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
    </div>
  );
}
