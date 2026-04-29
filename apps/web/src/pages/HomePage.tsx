import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useGuestLogin } from "../features/auth/useGuestLogin.js";
import { useAuthStore } from "../features/auth/auth.store.js";

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

export function HomePage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const guestLogin = useGuestLogin();
  const [username, setUsername] = useState("");
  const [color, setColor] = useState(colors[3] ?? "#22c55e");

  if (token) {
    return <Navigate to="/game" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.22),transparent_36%),linear-gradient(180deg,#120d08_0%,#09090b_100%)] px-6 py-10 text-stone-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Multiplayer Shared Grid</p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Claim a tile before someone else does.
          </h1>
          <p className="max-w-xl text-lg text-stone-300">
            Join instantly as a guest, pick your color, and compete for territory on a live 20x20 board.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              guestLogin.mutate(
                { username, color },
                {
                  onSuccess: () => {
                    navigate("/game");
                  }
                }
              );
            }}
          >
            <div>
              <label className="mb-2 block text-sm text-stone-300" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 placeholder:text-stone-500 focus:border-amber-400"
                placeholder="Enter your guest name"
                maxLength={30}
                required
              />
            </div>

            <div>
              <p className="mb-3 text-sm text-stone-300">Choose your color</p>
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

            {guestLogin.isError ? (
              <p className="text-sm text-rose-300">{guestLogin.error.message}</p>
            ) : null}

            <button
              type="submit"
              disabled={guestLogin.isPending}
              className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-stone-950 transition hover:bg-amber-300 disabled:opacity-70"
            >
              {guestLogin.isPending ? "Joining..." : "Enter the Arena"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
